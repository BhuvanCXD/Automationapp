import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Plus, X, Link, Key, ScanFace, ExternalLink, LogOut } from 'lucide-react';

interface OIDCConfigurationProps {
  onBack: () => void;
  onContinue: () => void;
  isDarkMode?: boolean;
}

export const OIDCConfiguration: React.FC<OIDCConfigurationProps> = ({ onBack, onContinue, isDarkMode = true }) => {
  const [redirectUris, setRedirectUris] = useState([
    'https://app.example.com/callback',
    'https://localhost:3000/callback'
  ]);
  const [postLogoutUri, setPostLogoutUri] = useState('');
  const [selectedGrants, setSelectedGrants] = useState<string[]>(['authorization_code']);
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['openid', 'profile']);

  const handleAddRedirectUri = () => {
    setRedirectUris([...redirectUris, '']);
  };

  const handleRemoveRedirectUri = (index: number) => {
    setRedirectUris(redirectUris.filter((_, i) => i !== index));
  };

  const handleRedirectUriChange = (index: number, value: string) => {
    const newUris = [...redirectUris];
    newUris[index] = value;
    setRedirectUris(newUris);
  };

  const toggleGrant = (grant: string) => {
    if (selectedGrants.includes(grant)) {
      setSelectedGrants(selectedGrants.filter(g => g !== grant));
    } else {
      setSelectedGrants([...selectedGrants, grant]);
    }
  };

  const toggleScope = (scope: string) => {
    if (selectedScopes.includes(scope)) {
      setSelectedScopes(selectedScopes.filter(s => s !== scope));
    } else {
      setSelectedScopes([...selectedScopes, scope]);
    }
  };

  return (
    <div className="h-full w-full flex flex-col p-4 max-w-[98%] mx-auto animate-fade-in">
      
      {/* Stepper */}
      <div className="relative w-full max-w-2xl mx-auto mb-8 px-4">
          {/* Connecting Line */}
          <div className={`absolute top-4 left-4 right-4 h-[1px] -z-10 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-300'}`}></div>

          <div className="flex justify-between items-start">
              {/* Step 1 - Completed */}
              <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs mb-2 z-10 shadow-[0_0_10px_rgba(59,130,246,0.2)] ${isDarkMode ? 'bg-[#1e293b] border-blue-500/50 text-blue-400' : 'bg-blue-50 border-blue-500 text-blue-600'}`}>1</div>
                  <span className={`text-xs font-medium tracking-wide ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Provider & Protocol</span>
              </div>
              
              {/* Step 2 - Active */}
              <div className="relative flex flex-col items-center">
                  <div className="absolute -inset-4 bg-blue-500/5 rounded-xl border border-blue-500/10 -z-10"></div>
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs mb-2 shadow-lg z-10 ${isDarkMode ? 'bg-[#1e293b] border-blue-500/30 text-white shadow-blue-900/20' : 'bg-blue-600 border-blue-600 text-white shadow-blue-500/30'}`}>2</div>
                  <span className={`text-xs font-semibold tracking-wide ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Configuration</span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center opacity-50">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs mb-2 z-10 ${isDarkMode ? 'bg-[#27272a] border-gray-700 text-gray-400' : 'bg-white border-gray-300 text-gray-500'}`}>3</div>
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Credentials</span>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center opacity-50">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs mb-2 z-10 ${isDarkMode ? 'bg-[#27272a] border-gray-700 text-gray-400' : 'bg-white border-gray-300 text-gray-500'}`}>4</div>
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Review & Deploy</span>
              </div>
          </div>
      </div>

      {/* Main Card */}
      <div className={`flex-1 min-h-0 flex flex-col border rounded-xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-[#18181b] border-white/10' : 'bg-white border-gray-200'}`}>
        
        {/* Card Header */}
        <div className={`p-6 border-b shrink-0 ${isDarkMode ? 'border-white/5 bg-[#222225]' : 'border-gray-200 bg-gray-50'}`}>
            <h2 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>OpenID Connect Settings</h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Configure the OpenID Connect settings for your new application.</p>
        </div>

        {/* Card Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left Column */}
                <div className="space-y-8">
                    
                    {/* Redirect URIs */}
                    <div className={`rounded-xl p-5 border ${isDarkMode ? 'bg-[#222225]/50 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                <Link size={18} />
                            </div>
                            <div>
                                <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Redirect URIs</h3>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Where users are sent after authentication</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {redirectUris.map((uri, index) => (
                                <div key={index} className="relative flex items-center">
                                    <span className={`absolute left-3 text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{index + 1}</span>
                                    <div className="relative flex-1">
                                        <input 
                                            type="text" 
                                            value={uri}
                                            onChange={(e) => handleRedirectUriChange(index, e.target.value)}
                                            className={`w-full border rounded-lg pl-8 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm transition-all ${isDarkMode ? 'bg-[#27272a] text-white border-gray-700 hover:border-gray-600 placeholder-gray-600' : 'bg-white text-gray-900 border-gray-300 hover:border-gray-400 placeholder-gray-400'}`}
                                            placeholder="https://"
                                        />
                                        <button 
                                            onClick={() => handleRemoveRedirectUri(index)}
                                            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isDarkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-600'}`}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            <button 
                                onClick={handleAddRedirectUri}
                                className={`w-full mt-2 py-2.5 border border-dashed rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 ${isDarkMode ? 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 hover:bg-white/5' : 'border-gray-300 text-gray-500 hover:text-gray-900 hover:border-gray-400 hover:bg-gray-50'}`}
                            >
                                <Plus size={14} />
                                Add Redirect URI
                            </button>
                        </div>
                    </div>

                    {/* Post-logout Redirect URI */}
                    <div className={`rounded-xl p-5 border ${isDarkMode ? 'bg-[#222225]/50 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                                <LogOut size={18} /> 
                            </div>
                            <div>
                                <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Post-logout Redirect URI</h3>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Where users land after signing out</p>
                            </div>
                        </div>

                        <input 
                            type="text" 
                            value={postLogoutUri}
                            onChange={(e) => setPostLogoutUri(e.target.value)}
                            className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm transition-all ${isDarkMode ? 'bg-[#27272a] text-white border-gray-700 hover:border-gray-600 placeholder-gray-600' : 'bg-white text-gray-900 border-gray-300 hover:border-gray-400 placeholder-gray-400'}`}
                            placeholder="e.g., https://yourapp.com/logout"
                        />
                    </div>

                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    
                    {/* Grant Types */}
                    <div className={`rounded-xl p-5 border ${isDarkMode ? 'bg-[#222225]/50 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                                <Key size={18} />
                            </div>
                            <div>
                                <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Grant Types</h3>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>How your app obtains access tokens</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <GrantTypeCard 
                                title="Authorization Code" 
                                description="For web applications to obtain tokens securely."
                                selected={selectedGrants.includes('authorization_code')}
                                onClick={() => toggleGrant('authorization_code')}
                                isDarkMode={isDarkMode}
                            />
                            <GrantTypeCard 
                                title="Client Credentials" 
                                description="For server-to-server communication."
                                selected={selectedGrants.includes('client_credentials')}
                                onClick={() => toggleGrant('client_credentials')}
                                isDarkMode={isDarkMode}
                            />
                            <GrantTypeCard 
                                title="Refresh Token" 
                                description="Obtain new access tokens without re-auth."
                                selected={selectedGrants.includes('refresh_token')}
                                onClick={() => toggleGrant('refresh_token')}
                                isDarkMode={isDarkMode}
                            />
                        </div>
                    </div>

                    {/* Scopes */}
                    <div className={`rounded-xl p-5 border ${isDarkMode ? 'bg-[#222225]/50 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                <ScanFace size={18} />
                            </div>
                            <div>
                                <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Scopes</h3>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Permissions your application requests</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {['openid', 'profile', 'email', 'offline_access', 'custom scope'].map(scope => (
                                <button
                                    key={scope}
                                    onClick={() => toggleScope(scope)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                                        selectedScopes.includes(scope)
                                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                        : (isDarkMode 
                                            ? 'bg-[#27272a] border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white' 
                                            : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900')
                                    }`}
                                >
                                    {scope}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

        </div>

        {/* Card Footer */}
        <div className={`p-4 border-t flex justify-between items-center shrink-0 ${isDarkMode ? 'bg-[#222225] border-white/5' : 'bg-gray-50 border-gray-200'}`}>
            <button 
                onClick={onBack}
                className={`flex items-center gap-2 font-medium px-4 py-2 transition-colors text-xs ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
            >
                <ArrowLeft size={14} />
                Back
            </button>
            
            <div className="flex items-center gap-6">
                <a href="#" className="hidden md:flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    Need help? View OIDC setup guide
                    <ExternalLink size={12} />
                </a>
                
                <button 
                    onClick={onContinue}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wide transition-all bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                >
                    Continue to Credentials
                    <ArrowRight size={14} />
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

const GrantTypeCard: React.FC<{ title: string; description: string; selected: boolean; onClick: () => void; isDarkMode?: boolean }> = ({ title, description, selected, onClick, isDarkMode = true }) => (
    <button 
        onClick={onClick}
        className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
            selected 
            ? (isDarkMode ? 'bg-white text-black border-white shadow-lg' : 'bg-blue-50 text-blue-900 border-blue-200 shadow-md')
            : (isDarkMode ? 'bg-[#27272a] text-white border-gray-700 hover:border-gray-500' : 'bg-white text-gray-900 border-gray-200 hover:border-gray-300')
        }`}
    >
        <div className="font-bold text-sm mb-1">{title}</div>
        <div className={`text-xs ${selected ? (isDarkMode ? 'text-gray-600' : 'text-blue-700') : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}`}>{description}</div>
    </button>
);
