import React, { useState } from 'react';

interface OAuthConfigurationProps {
  onBack: () => void;
  onContinue: () => void;
  isDarkMode?: boolean;
}

export const OAuthConfiguration: React.FC<OAuthConfigurationProps> = ({ onBack, onContinue, isDarkMode = true }) => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  
  // State for checkboxes
  const [grantTypes, setGrantTypes] = useState({
    authCode: false,
    implicit: false,
    clientCreds: false,
    refreshToken: false
  });

  const [scopes, setScopes] = useState({
    openid: false,
    profile: false,
    email: false,
    groups: false
  });

  const handleGrantChange = (key: keyof typeof grantTypes) => {
    setGrantTypes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleScopeChange = (key: keyof typeof scopes) => {
    setScopes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full max-w-[380px] animate-fade-in">
      <div className={`backdrop-blur-xl border rounded-2xl p-6 shadow-2xl ${isDarkMode ? 'bg-[#1e2330]/90 border-white/10' : 'bg-white border-gray-200'}`}>
        
        <h2 className={`text-lg font-bold mb-6 text-center tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          OAuth Application
        </h2>

        <div className="space-y-5">
          
          {/* Client ID */}
          <div className="space-y-1">
            <label className={`text-xs font-bold ml-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Client ID *
            </label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium shadow-sm h-10 ${isDarkMode ? 'bg-white text-gray-900' : 'bg-gray-50 text-gray-900 border border-gray-200'}`}
              placeholder=""
            />
          </div>

          {/* Client Secret */}
          <div className="space-y-1">
            <label className={`text-xs font-bold ml-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Client Secret *
            </label>
            <input
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium shadow-sm h-10 ${isDarkMode ? 'bg-white text-gray-900' : 'bg-gray-50 text-gray-900 border border-gray-200'}`}
              placeholder=""
            />
          </div>

          {/* Grant Types */}
          <div className="space-y-3">
            <label className={`text-xs font-bold ml-1 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Grant Types *
            </label>
            <div className="grid grid-cols-1 gap-2.5">
               <CheckboxRow 
                 label="Authorization Code" 
                 checked={grantTypes.authCode} 
                 onChange={() => handleGrantChange('authCode')} 
                 isDarkMode={isDarkMode}
               />
               <CheckboxRow 
                 label="Implicit" 
                 checked={grantTypes.implicit} 
                 onChange={() => handleGrantChange('implicit')} 
                 isDarkMode={isDarkMode}
               />
               <CheckboxRow 
                 label="Client Credentials" 
                 checked={grantTypes.clientCreds} 
                 onChange={() => handleGrantChange('clientCreds')} 
                 isDarkMode={isDarkMode}
               />
               <CheckboxRow 
                 label="Refresh Token" 
                 checked={grantTypes.refreshToken} 
                 onChange={() => handleGrantChange('refreshToken')} 
                 isDarkMode={isDarkMode}
               />
            </div>
          </div>

          {/* Scopes */}
          <div className="space-y-3">
            <label className={`text-xs font-bold ml-1 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Scopes *
            </label>
            <div className="grid grid-cols-1 gap-2.5">
               <CheckboxRow 
                 label="openid" 
                 checked={scopes.openid} 
                 onChange={() => handleScopeChange('openid')} 
                 isDarkMode={isDarkMode}
               />
               <CheckboxRow 
                 label="profile" 
                 checked={scopes.profile} 
                 onChange={() => handleScopeChange('profile')} 
                 isDarkMode={isDarkMode}
               />
               <CheckboxRow 
                 label="email" 
                 checked={scopes.email} 
                 onChange={() => handleScopeChange('email')} 
                 isDarkMode={isDarkMode}
               />
               <CheckboxRow 
                 label="groups" 
                 checked={scopes.groups} 
                 onChange={() => handleScopeChange('groups')} 
                 isDarkMode={isDarkMode}
               />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 space-y-3">
            <button 
              onClick={onContinue}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] text-sm"
            >
              Continue
            </button>
            <button 
              onClick={onBack}
              className={`w-full font-semibold py-2.5 rounded-lg border transition-colors text-sm ${isDarkMode ? 'bg-[#0B0E14] hover:bg-[#1a1f2e] text-gray-300 hover:text-white border-white/5' : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 border-gray-200'}`}
            >
              Back
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

const CheckboxRow: React.FC<{ label: string; checked: boolean; onChange: () => void; isDarkMode?: boolean }> = ({ label, checked, onChange, isDarkMode = true }) => (
  <label className="flex items-center group cursor-pointer py-0.5 gap-3">
    {/* Custom Checkbox */}
    <div className="relative flex items-center">
      <input 
        type="checkbox" 
        className="peer sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div className={`w-5 h-5 rounded flex items-center justify-center transition-all shadow-sm cursor-pointer ${checked ? 'bg-white' : (isDarkMode ? 'bg-white' : 'bg-gray-200')}`}>
        {checked && <div className="w-3 h-3 bg-blue-600 rounded-sm" />}
      </div>
    </div>
    <span className={`text-sm font-medium transition-colors select-none ${isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'}`}>
      {label}
    </span>
  </label>
);
