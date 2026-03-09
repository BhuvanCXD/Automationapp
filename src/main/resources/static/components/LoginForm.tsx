import React, { useState } from 'react';

interface LoginFormProps {
  onLogin?: (username: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('Shauryacyberx@gmail.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      if (onLogin) {
        onLogin(username);
      }
    }, 1500);
  };

  return (
    <div className="w-full max-w-[400px]">
      <div className="bg-[#111115]/80 backdrop-blur-md border border-white/5 rounded-2xl p-8 shadow-2xl">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white block">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#E2E2E5] border-none text-gray-900 text-sm rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 font-medium"
              placeholder="Enter Username"
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#E2E2E5] border-none text-gray-900 text-sm rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 font-medium"
              placeholder="Enter Password"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-gradient-to-r from-[#4361EE] to-[#3A0CA3] hover:from-[#3A0CA3] hover:to-[#4361EE] text-white font-medium py-3 px-4 rounded-md transition-all duration-200 shadow-lg shadow-blue-500/20 flex justify-center items-center"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : 'Login'}
          </button>
        </form>

      </div>
    </div>
  );
};