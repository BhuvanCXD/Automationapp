import React, { useState } from 'react';

interface RegisterFormProps {
  onRegister?: (username: string) => void;
  onBackToLogin?: () => void;
}

const getCSRFToken = (): string => {
  const name = 'XSRF-TOKEN';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || '';
  }
  return '';
};

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, onBackToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getCSRFToken(),
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! Please log in.');
        if (onBackToLogin) {
          onBackToLogin();
        }
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px]">
      <div className="bg-[#111115]/80 backdrop-blur-md border border-white/5 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#E2E2E5] border-none text-gray-900 text-sm rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 font-medium"
              placeholder="Enter Username"
              required
            />
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#E2E2E5] border-none text-gray-900 text-sm rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 font-medium"
              placeholder="Enter Email"
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#E2E2E5] border-none text-gray-900 text-sm rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 font-medium"
              placeholder="Enter Password"
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white block">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#E2E2E5] border-none text-gray-900 text-sm rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 font-medium"
              placeholder="Confirm Password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-gradient-to-r from-[#4361EE] to-[#3A0CA3] hover:from-[#3A0CA3] hover:to-[#4361EE] text-white font-medium py-3 px-4 rounded-md transition-all duration-200 shadow-lg shadow-blue-500/20 flex justify-center items-center"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : 'Register'}
          </button>

          {/* Back to Login */}
          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Already have an account? Login
          </button>
        </form>
      </div>
    </div>
  );
};
