import React, { useState, useEffect } from 'react';
import { ASSETS, TEXT } from '../../constants';
import { DEFAULT_WALLPAPER } from 'utils/constants';
import { useSession } from 'contexts/session';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [screenState, setScreenState] = useState<'lock' | 'login' | 'logging-in'>('lock');
  const [time, setTime] = useState(new Date());
  const { wallpaperImage } = useSession();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (screenState === 'lock') {
        setScreenState('login');
      } else if (screenState === 'login' && e.key === 'Enter') {
        handleLogin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screenState]);

  const handleLogin = () => {
    if (screenState === 'logging-in') return;
    setScreenState('logging-in');
    
    try {
      const audio = new Audio(ASSETS.soundLogin);
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio autoplay prevented'));
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  const handleScreenClick = () => {
    if (screenState === 'lock') {
      setScreenState('login');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div 
      className="w-screen h-screen flex flex-col font-sans overflow-hidden relative select-none bg-black"
      onClick={handleScreenClick}
    >
      {/* Background Image Container */}
      <div 
        className={`absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out will-change-transform ${
          screenState !== 'lock' ? 'scale-[1.03]' : 'scale-100'
        }`}
        style={{ 
          backgroundImage: `url(${(wallpaperImage || DEFAULT_WALLPAPER).replace(/\.(mp4|mov|webm)$/i, '.jpg')})`,
          filter: screenState !== 'lock' ? 'blur(20px) brightness(0.7)' : 'none'
        }}
      />

      {/* Slide-up Container for Lock Screen */}
      <div 
        className={`absolute inset-0 z-10 transition-transform duration-500 ease-in-out ${
          screenState !== 'lock' ? '-translate-y-[100vh] opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="absolute bottom-12 left-12 text-white" style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.6)' }}>
          <h1 className="text-7xl sm:text-8xl md:text-[8.5rem] font-light tracking-tight leading-none mb-1 select-none">
            {formatTime(time)}
          </h1>
          <p className="text-3xl sm:text-4xl md:text-5xl font-light ml-2 select-none">
            {formatDate(time)}
          </p>
        </div>
      </div>

      {/* Login Screen Content */}
      <div 
        className={`absolute inset-0 z-20 flex flex-col transition-opacity duration-500 delay-150 ${
          screenState !== 'lock' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex-1 flex flex-col items-center justify-center -mt-20">
          
          <div 
            className="flex flex-col items-center group cursor-pointer"
            onClick={screenState === 'login' ? handleLogin : undefined}
          >
            {/* Avatar */}
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden mb-6 bg-black/40 group-hover:ring-4 ring-white/30 transition-all shadow-2xl relative">
              <img 
                src={ASSETS.avatar} 
                alt="User Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* User Name */}
            <h2 className="text-white text-3xl sm:text-4xl font-normal drop-shadow-lg mb-8 tracking-wide">
              {TEXT.name}
            </h2>

            {/* Login Status or Dummy PIN/Button */}
            {screenState === 'login' ? (
              <div className="flex flex-col items-center">
                <button 
                  className="px-8 py-2 bg-white/10 hover:bg-white/20 border-2 border-transparent hover:border-white/30 text-white rounded transition-all font-medium text-lg tracking-wide backdrop-blur-md shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogin();
                  }}
                >
                  Sign in
                </button>
                <p className="text-white/60 mt-4 text-sm font-light uppercase tracking-widest text-[0.8rem] [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">
                  Click icon or hit Enter
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center animate-pulse">
                <div className="w-8 h-8 rounded-full border-2 border-white border-t-transparent animate-spin mb-4 shadow-lg" />
                <span className="text-white text-lg font-light tracking-wide text-shadow">Welcome</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Right Icons */}
        <div className="absolute bottom-8 right-8 flex gap-6 text-white drop-shadow-md">
           {/* Network Icon */}
           <svg className="w-6 h-6 sm:w-7 sm:h-7 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 4C7.58 4 3.58 5.79 0.61 8.81l2.83 2.83c2.26-2.26 5.37-3.64 8.56-3.64s6.3 1.38 8.56 3.64l2.83-2.83C20.42 5.79 16.42 4 12 4z"/>
             <path d="M12 11c-2.48 0-4.74.96-6.44 2.54l2.83 2.83c.96-.96 2.27-1.37 3.61-1.37s2.65.41 3.61 1.37l2.83-2.83C16.74 11.96 14.48 11 12 11z"/>
             <path d="M12 17c-.83 0-1.6.3-2.22.8l2.22 2.22 2.22-2.22c-.62-.5-1.39-.8-2.22-.8z"/>
           </svg>
           {/* Ease of Access Icon */}
           <svg className="w-6 h-6 sm:w-7 sm:h-7 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v6h-2zm0 8h2v2h-2z"/>
           </svg>
           {/* Power Icon */}
           <svg className="w-6 h-6 sm:w-7 sm:h-7 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" fill="currentColor" viewBox="0 0 24 24">
             <path d="M16.56 5.44l-1.45 1.45C16.84 8.44 18 10.08 18 12c0 3.31-2.69 6-6 6s-6-2.69-6-6c0-1.92 1.16-3.56 2.89-5.11l-1.45-1.45C5.16 7.39 4 9.56 4 12c0 4.42 3.58 8 8 8s8-3.58 8-8c0-2.44-1.16-4.61-3.44-6.56zM11 2h2v10h-2z"/>
           </svg>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
