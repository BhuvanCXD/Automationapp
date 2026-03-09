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

  const handleLogout = () => {
    fetch('/logout', { 
      method: 'POST',
      credentials: 'include' 
    }).then(() => {
      setUser(null);
      setShowRegister(false);
    });
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-black font-sans text-white transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Background Layer */}
      <CyberBackground />

      <div className={`relative z-10 w-full h-full flex flex-col ${!user ? 'items-center justify-center' : ''}`}>
        
        {!user ? (
          <div className="w-full flex flex-col items-center pt-12 md:pt-0">
             {/* Main Title - Only visible on Login */}
            <h1 className="text-lg font-bold tracking-tight text-white mb-12 drop-shadow-lg text-center px-4">
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
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
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

    </div>
  );
};

export default App;
