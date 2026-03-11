import React, { useState } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface OAuthConfigurationProps {
  onBack: () => void;
  onContinue: (data: any) => void;
}

export const OAuthConfiguration: React.FC<OAuthConfigurationProps> = ({ onBack, onContinue }) => {
  const [appName, setAppName] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [discoveryUrl, setDiscoveryUrl] = useState('');
  const [redirectUri, setRedirectUri] = useState('');
  
  const [scopes, setScopes] = useState({
    openid: true,
    profile: true,
    email: true,
    groups: false
  });

  const toggleScope = (key: keyof typeof scopes) => {
    setScopes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleContinue = () => {
    if (!appName || !clientId || !discoveryUrl || !redirectUri) {
      alert('Please fill in all required fields');
      return;
    }
    onContinue({
      type: 'OAuth',
      name: appName,
      clientId,
      clientSecret,
      discoveryUrl,
      redirectUri,
      scopes: Object.entries(scopes).filter(([_, v]) => v).map(([k]) => k)
    });
  };

  return (
    <div className="w-full max-w-4xl animate-fade-in">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest"
      >
        <ArrowLeft size={16} />
        Back to Selection
      </button>

      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">OAuth 2.0 Configuration</h2>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Configure OpenID Connect / OAuth 2.0 provider</p>
        </div>

        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-10 space-y-8">
          
          {/* Application Name */}
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Application Name *</label>
            <input 
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="e.g., Cloud Integration"
              className="w-full bg-slate-950/60 border border-white/5 rounded-2xl px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder:text-slate-700 font-bold"
            />
          </div>

          {/* Discovery URL */}
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Discovery URL *</label>
            <input 
              type="text"
              value={discoveryUrl}
              onChange={(e) => setDiscoveryUrl(e.target.value)}
              placeholder="https://provider.com/.well-known/openid-configuration"
              className="w-full bg-slate-950/60 border border-white/5 rounded-2xl px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder:text-slate-700 font-bold"
            />
          </div>

          {/* Client ID & Secret */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Client ID *</label>
              <input 
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Client ID"
                className="w-full bg-slate-950/60 border border-white/5 rounded-2xl px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder:text-slate-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Client Secret</label>
              <input 
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder="Client Secret"
                className="w-full bg-slate-950/60 border border-white/5 rounded-2xl px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder:text-slate-700 font-bold"
              />
            </div>
          </div>

          {/* Redirect URI */}
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Redirect URI *</label>
            <input 
              type="text"
              value={redirectUri}
              onChange={(e) => setRedirectUri(e.target.value)}
              placeholder="https://yourapp.com/callback"
              className="w-full bg-slate-950/60 border border-white/5 rounded-2xl px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder:text-slate-700 font-bold"
            />
          </div>

          {/* Scopes */}
          <div className="border-t border-white/5 pt-8">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Requested Scopes</label>
            <div className="grid grid-cols-2 gap-4">
              {['openid', 'profile', 'email', 'groups'].map((scope) => (
                <button
                  key={scope}
                  onClick={() => toggleScope(scope as keyof typeof scopes)}
                  className={`p-4 rounded-2xl border-2 transition-all text-left ${
                    scopes[scope as keyof typeof scopes]
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'
                      : 'bg-slate-950/40 border-white/5 text-slate-400 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      scopes[scope as keyof typeof scopes]
                        ? 'bg-cyan-500 border-cyan-500'
                        : 'border-white/20'
                    }`}>
                      {scopes[scope as keyof typeof scopes] && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="font-bold uppercase tracking-wide text-sm">{scope}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-6">
          <button 
            onClick={onBack}
            className="flex-1 bg-slate-900/60 hover:bg-slate-900 border border-white/5 text-white font-black py-4 rounded-2xl transition-all uppercase tracking-widest"
          >
            Back
          </button>
          <button 
            onClick={handleContinue}
            className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-2xl transition-all shadow-2xl shadow-cyan-600/30 uppercase tracking-widest flex items-center justify-center gap-3 group"
          >
            Continue Setup
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
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
