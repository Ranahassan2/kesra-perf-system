import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, LockOpen, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { t, language, toggleLanguage } = useLanguage();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t.loginErrorEmpty);
      return;
    }
    try {
      setError('');
      login(email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-neutral-950"
      style={{ 
        backgroundImage: 'linear-gradient(rgba(10, 13, 17, 0.85), rgba(10, 13, 17, 0.85)), url(/back.png)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      {/* Background decorations removed */}

      {/* Language Toggle */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/40 hover:bg-white/10 transition-colors text-white text-xs font-bold shadow-lg backdrop-blur-md"
        >
          <Globe className="w-4 h-4 text-teal-400" />
          {language === 'ar' ? 'العربية' : 'English'}
        </button>
      </div>

      {/* Brand Header */}
      <div className="mb-16 -mt-32 text-center z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-[#241a05] text-2xl bg-amber-400 shadow-lg shadow-amber-400/20">
            K
          </div>
          <h1 className="text-4xl font-display font-black text-white tracking-widest">
            KESRA
          </h1>
        </div>
        <p className="text-slate-300 font-medium tracking-wide text-sm md:text-base">
          {t.loginSubtitle}
        </p>
      </div>

      <div
        className="relative w-full max-w-md p-8 rounded-3xl border border-teal-500/30 shadow-[0_0_30px_rgba(20,184,166,0.1)] z-10"
        style={{ background: '#0f172a' }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 mb-4 shadow-[0_0_15px_rgba(20,184,166,0.15)]">
            <ShieldCheck className="w-8 h-8 text-teal-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{t.loginTitle}</h1>
          <p className="text-sm text-slate-400">{t.appName}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-bold text-white mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                {t.emailLabel}
              </label>
              <div className="relative">
                <Mail className={`absolute ${language === 'ar' ? 'left-3' : 'right-3'} top-3 h-5 w-5 text-slate-500 pointer-events-none`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className={`w-full rounded-xl border border-white/10 bg-black/40 py-3 ${language === 'ar' ? 'pl-10 pr-4' : 'pr-10 pl-4'} text-sm text-white focus:border-teal-500/50 focus:outline-none focus:ring-1 focus:ring-teal-500/50 transition-all`}
                  dir="ltr"
                  placeholder="name@kesraa.com"
                />
              </div>
            </div>
            
            <div>
              <label className={`block text-sm font-bold text-white mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                {t.passwordLabel}
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${language === 'ar' ? 'left-3' : 'right-3'} top-3 text-slate-500 hover:text-slate-300 transition-colors`}
                  title={showPassword ? t.hidePassword : t.showPassword}
                >
                  {showPassword ? <LockOpen className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                </button>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className={`w-full rounded-xl border border-white/10 bg-black/40 py-3 ${language === 'ar' ? 'pl-10 pr-4' : 'pr-10 pl-4'} text-sm text-white focus:border-teal-500/50 focus:outline-none focus:ring-1 focus:ring-teal-500/50 transition-all`}
                  dir="ltr"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>
          
          {error && <p className="mt-2 text-xs text-rose-400 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold py-3 transition-colors shadow-lg shadow-teal-500/25 mt-2"
          >
            {t.loginButton}
          </button>
        </form>
        
      </div>
    </div>
  );
};
