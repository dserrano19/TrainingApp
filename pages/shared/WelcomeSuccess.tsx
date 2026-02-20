import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface WelcomeSuccessProps {
  role: string;
}

const WelcomeSuccess: React.FC<WelcomeSuccessProps> = ({ role }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // We check sessionStorage instead of localStorage to show it once per browser session
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    if (hasSeenWelcome === 'true') {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleEnterDashboard = () => {
    sessionStorage.setItem('hasSeenWelcome', 'true');
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-between overflow-hidden bg-white dark:bg-[#1c2210] p-6 animate-in fade-in duration-700 font-display">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-accent/5 blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[200px] h-[200px] rounded-full bg-accent/10 blur-[60px] pointer-events-none"></div>

      <div className="flex justify-center pt-4">
        <div className="w-12 h-1 rounded-full bg-slate-100 dark:bg-white/10"></div>
      </div>

      <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto z-10">
        {/* Success Visual */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-tr from-accent to-transparent rounded-full blur opacity-30 animate-pulse"></div>
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-[#1c2210] shadow-2xl bg-slate-50">
            <div
              className="w-full h-full bg-center bg-cover bg-no-repeat opacity-90 grayscale"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB0UQ_6fkMWxCLsoUwBn8tnFLl5_WfbSooE_J3G-fYzsowRqxcTV2S0q2laSa7h9CyQS19Fq-NSurm5end2bO19jnY9HdkDLXOuWKydi4sdv4BiQmZVD6QUnbqFefebJZU8IUylAjVp0iw9iUUrRVtdUunKtHtX_QSdOtV3psg5nTYnE7AhJg5dztcNAXHHVcChU4M3TcIEYNuns63PZpuIM0pl9UPQ4wEtyP12CeTWVRa8nQGCogg1Y-sYZFsNeCjldT5kyKifug")' }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <div className="w-12 h-12 bg-accent text-black rounded-full flex items-center justify-center shadow-lg transform translate-y-8 translate-x-8">
                <span className="material-symbols-outlined text-3xl font-bold">check</span>
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tightest">
            All Systems Go
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-relaxed max-w-[320px]">
            {role === 'Coach' ? 'Welcome to ' : 'Bienvenido a '}
            <strong className="text-slate-900 dark:text-white font-semibold">TrainingDiary</strong>.
            {role === 'Coach' ? 'Your account is verified. Let\'s initialize your first training cycle.' : 'Tu cuenta ha sido verificada. Vamos a inicializar tu primer ciclo de entrenamiento.'}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleEnterDashboard}
          className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-6 bg-accent hover:bg-[#a6e22e] text-black text-lg font-bold leading-normal tracking-wide shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
        >
          <span className="truncate mr-2">{role === 'Coach' ? 'Enter Dashboard' : 'Entrar al Panel'}</span>
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="flex flex-col items-center pb-4 z-10">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
          <span className="material-symbols-outlined text-[18px] text-slate-400">badge</span>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            {role === 'Coach' ? 'Signed in as ' : 'Iniciado como '}
            <span className="text-slate-900 dark:text-white font-semibold">{role}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSuccess;
