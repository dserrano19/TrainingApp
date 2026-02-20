
export type UserRole = 'ATHLETE' | 'COACH';

export interface Athlete {
  id: string;
  name: string;
  specialty: string;
  status: 'READY' | 'WATCH' | 'CRITICAL';
  statusMsg?: string;
  avatar: string;
  lastActive?: string;
}

export interface Session {
  id: string;
  title: string;
  date: string;
  type: string;
  duration: string;
  location: string;
  blocks: SessionBlock[];
}

export interface SessionBlock {
  id: string;
  title: string;
  duration: string;
  tasks: Task[];
  isMain?: boolean;
}

export interface Task {
  id: string;
  description: string;
  note?: string;
  sets?: string;
  isCompleted: boolean;
  link?: { label: string; url: string };
}

export interface Profile {
  id: string;
  updated_at?: string;
  full_name?: string;
  role: UserRole;
  avatar_url?: string;
  username?: string;
  weight?: number;
  license_number?: string;
  birth_date?: string;
  group_code?: string;
  height?: number;
  season_goals?: string;
  specialty?: string;
  gender?: string;
  personal_bests?: any; // jsonb
  clothing_size?: string;
  injury_history?: string;
}

export interface Document {
  id: string;
  created_at: string;
  title: string;
  content?: string;
  file_url?: string;
  coach_id: string;
}

// Extends the frontend Session interface or mirrors the DB structure
export interface SessionDB {
  id: string;
  created_at: string;
  athlete_id: string;
  date: string;
  title: string;
  type?: string;
  duration?: string;
  location?: string;
  rpe?: number;
  feedback?: string;
  blocks: SessionBlock[]; // Stored as jsonb
}
