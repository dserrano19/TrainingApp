
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../components/supabaseClient';

interface LoginProps {
  onLogin: () => void;
  onBack: () => void;
  onRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack, onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check connection on mount
    const checkConnection = async () => {
      console.log('Checking Supabase connection...');
      const { error } = await supabase.from('nothing').select('*').limit(0);
      if (error && error.code !== '42P01') { // 42P01 is "undefined_table", which means connection works but table missing
        console.error('Supabase connection issue:', error.message);
      } else {
        console.log('Supabase connected successfully (or client initialized)');
      }
    };
    checkConnection();
  }, []);

  const handleLoginClick = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      onLogin();
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMsg(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-app flex flex-col max-w-md mx-auto relative animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex items-center justify-between p-4 pt-12 pb-2">
        <button
          onClick={onBack}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 transition-colors"
        >
          <span className="material-symbols-outlined text-black" style={{ fontSize: '24px' }}>arrow_back</span>
        </button>
        <h2 className="text-black text-lg font-bold tracking-tight font-label uppercase tracking-widest">TrainingDiary</h2>
        <div className="size-10"></div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-6 pt-12 pb-8">
        {/* Headline */}
        <div className="mb-12 text-center">
          <h1 className="text-black text-[36px] font-extrabold leading-tight tracking-tightest font-label">Bienvenido</h1>
          <p className="text-gray-500 text-sm mt-2 font-medium font-label">Ingresa tus credenciales para acceder al sistema.</p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium text-center">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <div className="flex flex-col gap-8">
          {/* Email Field */}
          <div className="flex flex-col gap-2.5 group">
            <label className="text-black text-[10px] font-bold uppercase tracking-[0.15em] ml-1 font-label">Email</label>
            <div className="relative">
              <input
                className="w-full h-14 bg-black text-white placeholder-gray-600 border-2 border-transparent focus:border-accent rounded-2xl px-5 text-sm font-medium outline-none transition-all duration-300 font-nums"
                placeholder="atleta@trainingdiary.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2.5 group">
            <label className="text-black text-[10px] font-bold uppercase tracking-[0.15em] ml-1 font-label">Contraseña</label>
            <div className="relative flex items-center">
              <input
                className="w-full h-14 bg-black text-white placeholder-gray-600 border-2 border-transparent focus:border-accent rounded-2xl px-5 pr-12 text-sm font-medium outline-none transition-all duration-300 font-nums"
                placeholder="Ingresa tu contraseña"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-gray-600 hover:text-white transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <button className="text-gray-400 text-xs font-bold hover:text-black transition-colors font-label uppercase tracking-widest">¿Olvidaste la contraseña?</button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto pt-16 space-y-8">
          <button
            onClick={handleLoginClick}
            disabled={loading}
            className="w-full h-16 bg-accent hover:bg-accent-dim text-black font-extrabold text-[15px] uppercase tracking-widest rounded-2xl flex items-center justify-center transition-all active:scale-[0.98] shadow-xl shadow-accent/20 font-label disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Cargando...' : 'Entrar'}
          </button>

          <div className="flex items-center justify-center gap-2">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest font-label">¿Eres nuevo?</p>
            <button
              onClick={onRegister}
              className="text-black font-extrabold text-xs uppercase tracking-widest border-b-2 border-black pb-0.5 hover:border-transparent transition-all font-label"
            >
              Crear Cuenta
            </button>
          </div>
        </div>
      </main>

      {/* Decorative Footer Element */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-50"></div>
    </div>
  );
};

export default Login;
