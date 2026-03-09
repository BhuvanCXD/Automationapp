import React, { useState } from 'react';
import { Key, Shield, Lock, ChevronDown, ArrowRight } from 'lucide-react';

interface ApplicationTypeSelectorProps {
  onBack: () => void;
  onSelect: (type: 'oauth' | 'saml' | 'oidc') => void;
  isDarkMode?: boolean;
}

export const ApplicationTypeSelector: React.FC<ApplicationTypeSelectorProps> = ({ onBack, onSelect, isDarkMode = true }) => {
  const [selectedIdp, setSelectedIdp] = useState('');
  const [selectedAppType, setSelectedAppType] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState<'oauth' | 'saml' | 'oidc' | null>(null);

  const handleContinue = () => {
    if (selectedProtocol) {
      onSelect(selectedProtocol);
    }
  };

  return (
    <div className="h-full w-full flex flex-col p-4 max-w-[98%] mx-auto animate-fade-in">
      
      {/* Stepper */}
      <div className="relative w-full max-w-2xl mx-auto mb-8 px-4">
          {/* Connecting Line */}
          <div className={`absolute top-4 left-4 right-4 h-[1px] -z-10 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-300'}`}></div>

          <div className="flex justify-between items-start">
              {/* Step 1 */}
              <div className="relative flex flex-col items-center">
                  <div className="absolute -inset-4 bg-blue-500/5 rounded-xl border border-blue-500/10 -z-10"></div>
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs mb-2 shadow-lg z-10 ${isDarkMode ? 'bg-[#1e293b] border-blue-500/30 text-white shadow-blue-900/20' : 'bg-blue-600 border-blue-600 text-white shadow-blue-500/30'}`}>1</div>
                  <span className={`text-xs font-semibold tracking-wide ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Provider & Protocol</span>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs mb-2 z-10 ${isDarkMode ? 'bg-[#27272a] border-gray-700 text-gray-400' : 'bg-white border-gray-300 text-gray-500'}`}>2</div>
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Setting</span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs mb-2 z-10 ${isDarkMode ? 'bg-[#27272a] border-gray-700 text-gray-400' : 'bg-white border-gray-300 text-gray-500'}`}>3</div>
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Credentials</span>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs mb-2 z-10 ${isDarkMode ? 'bg-[#27272a] border-gray-700 text-gray-400' : 'bg-white border-gray-300 text-gray-500'}`}>4</div>
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Review & Deploy</span>
              </div>
          </div>
      </div>

      {/* Main Card */}
      <div className={`flex-1 min-h-0 flex flex-col border rounded-xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-[#18181b] border-white/10' : 'bg-white border-gray-200'}`}>
        
        {/* Card Header */}
        <div className={`p-4 border-b shrink-0 ${isDarkMode ? 'border-white/5 bg-[#222225]' : 'border-gray-200 bg-gray-50'}`}>
            <h2 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Setup Your Connection</h2>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Configure your application's authentication by selecting a provider and protocol</p>
        </div>

        {/* Card Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            
            {/* Dropdowns Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Identity Provider */}
                <div className="space-y-1.5">
                    <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Identity Provider
                    </label>
                    <div className="relative">
                        <select 
                            className={`w-full border rounded-lg px-3 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm transition-all ${isDarkMode ? 'bg-[#27272a] text-white border-gray-700 hover:border-gray-600' : 'bg-white text-gray-900 border-gray-300 hover:border-gray-400'}`}
                            value={selectedIdp}
                            onChange={(e) => setSelectedIdp(e.target.value)}
                        >
                            <option value="" disabled>Select Provider</option>
                            <option value="okta">Okta</option>
                            <option value="auth0">Auth0</option>
                            <option value="azure">Azure AD</option>
                            <option value="google">Google Workspace</option>
                        </select>
                        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} size={16} />
                    </div>
                    <p className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Your organization's identity provider</p>
                </div>

                {/* Application Type */}
                <div className="space-y-1.5">
                    <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Application Type
                    </label>
                    <div className="relative">
                        <select 
                            className={`w-full border rounded-lg px-3 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm transition-all ${isDarkMode ? 'bg-[#27272a] text-white border-gray-700 hover:border-gray-600' : 'bg-white text-gray-900 border-gray-300 hover:border-gray-400'}`}
                            value={selectedAppType}
                            onChange={(e) => setSelectedAppType(e.target.value)}
                        >
                            <option value="" disabled>Select Type</option>
                            <option value="web">Web Application</option>
                            <option value="spa">Single Page App (SPA)</option>
                            <option value="native">Native Mobile App</option>
                            <option value="service">Service / Daemon</option>
                        </select>
                        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} size={16} />
                    </div>
                    <p className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>The type of application you're integrating</p>
                </div>
            </div>

            <div className={`h-px w-full ${isDarkMode ? 'bg-white/5' : 'bg-gray-200'}`}></div>

            {/* Protocol Selection */}
            <div className="space-y-3">
                <div className="mb-1">
                    <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Select Authentication Protocol</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Choose the protocol that best matches your application's security requirements</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {/* SAML Card */}
                    <button 
                        onClick={() => setSelectedProtocol('saml')}
                        className={`w-full text-left relative group rounded-xl border p-3 transition-all duration-200 flex items-start gap-3 ${
                            selectedProtocol === 'saml' 
                            ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                            : (isDarkMode ? 'bg-[#27272a]/50 border-white/5 hover:border-white/10 hover:bg-[#27272a]' : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50')
                        }`}
                    >
                        <div className={`p-2.5 rounded-lg shrink-0 transition-colors ${selectedProtocol === 'saml' ? 'bg-blue-500 text-white' : (isDarkMode ? 'bg-[#3f3f46] text-gray-400 group-hover:text-white' : 'bg-gray-100 text-gray-500 group-hover:text-blue-600')}`}>
                            <Shield size={20} strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5 flex-wrap gap-2">
                                <span className={`font-bold text-base ${selectedProtocol === 'saml' ? 'text-blue-400' : (isDarkMode ? 'text-white' : 'text-gray-900')}`}>SAML 2.0</span>
                                <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'bg-[#27272a] border-white/5 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
                                    Enterprise
                                </span>
                            </div>
                            <p className={`text-xs transition-colors ${isDarkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-700'}`}>Enterprise-grade single sign-on with XML-based authentication.</p>
                        </div>
                    </button>

                    {/* OAuth Card */}
                    <button 
                        onClick={() => setSelectedProtocol('oauth')}
                        className={`w-full text-left relative group rounded-xl border p-3 transition-all duration-200 flex items-start gap-3 ${
                            selectedProtocol === 'oauth' 
                            ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
                            : (isDarkMode ? 'bg-[#27272a]/50 border-white/5 hover:border-white/10 hover:bg-[#27272a]' : 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50')
                        }`}
                    >
                        <div className={`p-2.5 rounded-lg shrink-0 transition-colors ${selectedProtocol === 'oauth' ? 'bg-purple-500 text-white' : (isDarkMode ? 'bg-[#3f3f46] text-gray-400 group-hover:text-white' : 'bg-gray-100 text-gray-500 group-hover:text-purple-600')}`}>
                            <Key size={20} strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5 flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                    <span className={`font-bold text-base ${selectedProtocol === 'oauth' ? 'text-purple-400' : (isDarkMode ? 'text-white' : 'text-gray-900')}`}>OAuth 2.0</span>
                                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wide border border-purple-500/20">
                                        Recommended
                                    </span>
                                </div>
                                <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'bg-[#27272a] border-white/5 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
                                    API Access
                                </span>
                            </div>
                            <p className={`text-xs transition-colors ${isDarkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-700'}`}>Industry-standard authorization framework for delegated access.</p>
                        </div>
                    </button>

                    {/* OIDC Card */}
                    <button 
                        onClick={() => setSelectedProtocol('oidc')}
                        className={`w-full text-left relative group rounded-xl border p-3 transition-all duration-200 flex items-start gap-3 ${
                            selectedProtocol === 'oidc' 
                            ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                            : (isDarkMode ? 'bg-[#27272a]/50 border-white/5 hover:border-white/10 hover:bg-[#27272a]' : 'bg-white border-gray-200 hover:border-emerald-300 hover:bg-emerald-50')
                        }`}
                    >
                        <div className={`p-2.5 rounded-lg shrink-0 transition-colors ${selectedProtocol === 'oidc' ? 'bg-emerald-500 text-white' : (isDarkMode ? 'bg-[#3f3f46] text-gray-400 group-hover:text-white' : 'bg-gray-100 text-gray-500 group-hover:text-emerald-600')}`}>
                            <Lock size={20} strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5 flex-wrap gap-2">
                                <span className={`font-bold text-base ${selectedProtocol === 'oidc' ? 'text-emerald-400' : (isDarkMode ? 'text-white' : 'text-gray-900')}`}>OpenID Connect</span>
                                <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'bg-[#27272a] border-white/5 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
                                    Modern Apps
                                </span>
                            </div>
                            <p className={`text-xs transition-colors ${isDarkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-700'}`}>Modern authentication layer built on OAuth 2.0 with identity tokens.</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>

        {/* Card Footer */}
        <div className={`p-4 border-t flex justify-between items-center shrink-0 ${isDarkMode ? 'bg-[#222225] border-white/5' : 'bg-gray-50 border-gray-200'}`}>
            <button 
                onClick={onBack}
                className={`font-medium px-4 py-2 transition-colors text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
            >
                Cancel
            </button>
            <button 
                onClick={handleContinue}
                disabled={!selectedProtocol}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wide transition-all ${
                    selectedProtocol 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                    : (isDarkMode ? 'bg-[#27272a] text-gray-500 border border-white/5' : 'bg-gray-200 text-gray-400 border border-gray-300')
                } ${!selectedProtocol ? 'cursor-not-allowed' : ''}`}
            >
                Continue to Configuration
                <ArrowRight size={14} />
            </button>
        </div>

      </div>
    </div>
  );
};