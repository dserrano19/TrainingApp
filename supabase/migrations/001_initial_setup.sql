
-- Create a table for public profiles
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  role text check (role in ('ATHLETE', 'COACH')),
  avatar_url text,
  
  constraint username_length check (char_length(full_name) >= 3)
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Handle new user signup with a trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'role',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create Documents table (for Coaches)
create table public.documents (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  content text,
  file_url text,
  coach_id uuid references public.profiles(id) not null
);

alter table public.documents enable row level security;

create policy "Documents are viewable by everyone."
  on public.documents for select
  using ( true );

create policy "Coaches can insert documents."
  on public.documents for insert
  with check ( 
    auth.uid() = coach_id 
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'COACH'
    )
  );

create policy "Coaches can update their own documents."
  on public.documents for update
  using ( auth.uid() = coach_id );

create policy "Coaches can delete their own documents."
  on public.documents for delete
  using ( auth.uid() = coach_id );


-- Create Sessions table (for Athletes)
create table public.sessions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  date date not null,
  title text not null,
  type text,
  duration text,
  location text,
  rpe integer,
  feedback text,
  blocks jsonb, -- Stores the session blocks and tasks structure
  athlete_id uuid references public.profiles(id) not null
);

alter table public.sessions enable row level security;

create policy "Athletes can view their own sessions."
  on public.sessions for select
  using ( auth.uid() = athlete_id );

-- Allow coaches to view all sessions (simplified for now, ideally would check for a coach-athlete relationship)
create policy "Coaches can view all sessions."
  on public.sessions for select
  using ( 
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'COACH'
    )
  );

create policy "Athletes can insert their own sessions."
  on public.sessions for insert
  with check ( auth.uid() = athlete_id );

create policy "Athletes can update their own sessions."
  on public.sessions for update
  using ( auth.uid() = athlete_id );

