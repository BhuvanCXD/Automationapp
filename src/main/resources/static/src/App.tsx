import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { CyberBackground } from './components/CyberBackground';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (username: string) => {
    setUser(username);
    setShowRegister(false);
  };

  const getCSRFToken = (): string => {
    const name = 'XSRF-TOKEN';
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || '';
    }
    return '';
  };

  const handleLogout = () => {
    fetch('/logout', { 
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': getCSRFToken(),
      }
    })
    .then(response => {
      if (response.ok || response.status === 200) {
        setUser(null);
        setShowRegister(false);
      }
    })
    .catch(() => {
      // Logout on client side even if server request fails
      setUser(null);
      setShowRegister(false);
    });
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-black font-sans text-white transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Background Layer */}
      <CyberBackground />

      {/* Top Left Logo (Visible on Dashboard) */}
      {user && (
         <div className="absolute top-6 left-6 z-20 flex items-center gap-2 animate-fade-in">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center font-bold text-white">C</div>
            <span className="font-bold tracking-tight text-lg">Cyber</span>
         </div>
      )}

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        
        {!user ? (
          <div className="w-full flex flex-col items-center pt-12 md:pt-0">
             {/* Main Title - Only visible on Login */}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-12 drop-shadow-lg text-center px-4">
              Cyber X Delta
            </h1>
            
            <div className="w-full px-4 flex justify-center">
              {showRegister ? (
                <RegisterForm 
                  onRegister={handleLogin}
                  onBackToLogin={() => setShowRegister(false)}
                />
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <LoginForm onLogin={handleLogin} />
                  <button
                    onClick={() => setShowRegister(true)}
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-bold uppercase tracking-wide"
                  >
                    Don't have an account? Register here
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Dashboard username={user} onLogout={handleLogout} />
        )}

      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-in; }
      `}</style>
    </div>
  );
};

export default App;
