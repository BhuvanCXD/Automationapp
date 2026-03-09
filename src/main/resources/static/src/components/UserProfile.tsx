import React from 'react';
import { User, Mail, Shield, Key, LogOut, ChevronLeft, Calendar, MapPin, Globe } from 'lucide-react';

interface UserProfileProps {
  username: string;
  onBack: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ username, onBack, onLogout, isDarkMode }) => {
  return (
    <div className="p-4 md:p-8 pt-32 animate-fade-in max-w-4xl mx-auto w-full">
      <button 
        onClick={onBack}
        className={`flex items-center gap-2 mb-8 text-sm font-medium transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
      >
        <ChevronLeft size={16} />
        Back to Dashboard
      </button>

      <div className={`rounded-2xl border overflow-hidden shadow-2xl ${isDarkMode ? 'bg-[#18181b] border-white/5' : 'bg-white border-gray-200'}`}>
        {/* Profile Header */}
        <div className={`h-32 relative ${isDarkMode ? 'bg-gradient-to-r from-blue-900/40 to-cyan-900/40' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}>
          <div className="absolute -bottom-12 left-8">
            <div className={`w-24 h-24 rounded-2xl overflow-hidden border-4 ${isDarkMode ? 'border-[#18181b] bg-gray-800' : 'border-white bg-gray-200'}`}>
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="User" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{username}</h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Security Administrator • CyberXDelta</p>
            </div>
            <button 
              onClick={onLogout}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                isDarkMode 
                ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20' 
                : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100'
              }`}
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Account Info */}
            <div className="space-y-6">
              <h2 className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Account Information</h2>
              <div className="space-y-4">
                <InfoItem 
                  icon={<Mail size={18} />} 
                  label="Email Address" 
                  value={`${username.toLowerCase()}@cyberxdelta.com`} 
                  isDarkMode={isDarkMode} 
                />
                <InfoItem 
                  icon={<Shield size={18} />} 
                  label="Access Level" 
                  value="Tier 1 Administrator" 
                  isDarkMode={isDarkMode} 
                />
                <InfoItem 
                  icon={<Calendar size={18} />} 
                  label="Member Since" 
                  value="January 2024" 
                  isDarkMode={isDarkMode} 
                />
              </div>
            </div>

            {/* Security Status */}
            <div className="space-y-6">
              <h2 className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Security Settings</h2>
              <div className="space-y-4">
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Key size={18} className="text-blue-500" />
                      <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Multi-Factor Auth</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 border border-emerald-500/20">Enabled</span>
                  </div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last verified 2 hours ago from San Francisco, CA</p>
                </div>

                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Globe size={18} className="text-cyan-500" />
                      <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Session Persistence</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-500 border border-blue-500/20">Active</span>
                  </div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current session expires in 4 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string; isDarkMode: boolean }> = ({ icon, label, value, isDarkMode }) => (
  <div className="flex items-center gap-4">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
      {icon}
    </div>
    <div>
      <p className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{label}</p>
      <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
    </div>
  </div>
);
