import React from 'react';
import { ArrowLeft, Check, Copy, ExternalLink, Shield, Key, Lock } from 'lucide-react';

interface ReviewAndCreateProps {
  onBack: () => void;
  onCreate: () => void;
  isDarkMode?: boolean;
}

export const ReviewAndCreate: React.FC<ReviewAndCreateProps> = ({ onBack, onCreate, isDarkMode = true }) => {
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
              
              {/* Step 2 - Completed */}
              <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs mb-2 z-10 shadow-[0_0_10px_rgba(59,130,246,0.2)] ${isDarkMode ? 'bg-[#1e293b] border-blue-500/50 text-blue-400' : 'bg-blue-50 border-blue-500 text-blue-600'}`}>2</div>
                  <span className={`text-xs font-medium tracking-wide ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Configuration</span>
              </div>

              {/* Step 3 - Completed */}
              <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs mb-2 z-10 shadow-[0_0_10px_rgba(59,130,246,0.2)] ${isDarkMode ? 'bg-[#1e293b] border-blue-500/50 text-blue-400' : 'bg-blue-50 border-blue-500 text-blue-600'}`}>3</div>
                  <span className={`text-xs font-medium tracking-wide ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Access & Assignment</span>
              </div>

              {/* Step 4 - Active */}
              <div className="relative flex flex-col items-center">
                  <div className="absolute -inset-4 bg-blue-500/5 rounded-xl border border-blue-500/10 -z-10"></div>
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs mb-2 shadow-lg z-10 ${isDarkMode ? 'bg-[#1e293b] border-blue-500/30 text-white shadow-blue-900/20' : 'bg-blue-600 border-blue-600 text-white shadow-blue-500/30'}`}>4</div>
                  <span className={`text-xs font-semibold tracking-wide ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Review & Deploy</span>
              </div>
          </div>
      </div>

      {/* Main Card */}
      <div className={`flex-1 min-h-0 flex flex-col border rounded-xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-[#18181b] border-white/10' : 'bg-white border-gray-200'}`}>
        
        {/* Card Header */}
        <div className={`p-6 border-b shrink-0 ${isDarkMode ? 'border-white/5 bg-[#222225]' : 'border-gray-200 bg-gray-50'}`}>
            <h2 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Step 4 of 4: Review & Create</h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Review the configuration details before creating your connection.</p>
        </div>

        {/* Card Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            
            {/* Application Summary */}
            <section className={`border rounded-xl p-6 ${isDarkMode ? 'bg-[#222225]/50 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className={`text-base font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Application Summary</h3>
                <p className={`text-xs mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Review the configuration details before creating your connection.</p>
                
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg border ${isDarkMode ? 'bg-[#27272a]/50 border-white/5' : 'bg-white border-gray-200'}`}>
                    <div>
                        <label className={`text-xs font-semibold uppercase tracking-wider block mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Provider</label>
                        <div className={`font-medium flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Okta
                        </div>
                    </div>
                    <div>
                        <label className={`text-xs font-semibold uppercase tracking-wider block mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Protocol</label>
                        <div className={`font-medium flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            <Shield size={16} className="text-blue-400" />
                            SAML 2.0
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className={`text-xs font-semibold uppercase tracking-wider block mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Application Name</label>
                        <div className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Salesforce CRM Integration
                        </div>
                    </div>
                </div>
            </section>

            {/* SAML Configuration Details */}
            <section className={`border rounded-xl p-6 ${isDarkMode ? 'bg-[#222225]/50 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className={`text-base font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>SAML Configuration Details</h3>
                
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Entity ID</label>
                            <div className={`border rounded-lg px-4 py-2.5 text-sm font-mono truncate ${isDarkMode ? 'bg-[#27272a] text-gray-300 border-gray-700' : 'bg-white text-gray-600 border-gray-200'}`}>
                                https://app.example.com/saml/metadata
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>ACS URL</label>
                            <div className={`border rounded-lg px-4 py-2.5 text-sm font-mono truncate ${isDarkMode ? 'bg-[#27272a] text-gray-300 border-gray-700' : 'bg-white text-gray-600 border-gray-200'}`}>
                                https://app.example.com/saml/acs
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>NameID Format</label>
                        <div className={`border rounded-lg px-4 py-2.5 text-sm font-mono ${isDarkMode ? 'bg-[#27272a] text-gray-300 border-gray-700' : 'bg-white text-gray-600 border-gray-200'}`}>
                            urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Attribute Mappings</label>
                        <div className="flex flex-wrap gap-2">
                            <div className={`px-3 py-1.5 rounded-md border text-xs font-mono ${isDarkMode ? 'bg-[#27272a] border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`}>
                                email → mail
                            </div>
                            <div className={`px-3 py-1.5 rounded-md border text-xs font-mono ${isDarkMode ? 'bg-[#27272a] border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`}>
                                groups → memberOf
                            </div>
                            <div className={`px-3 py-1.5 rounded-md border text-xs font-mono ${isDarkMode ? 'bg-[#27272a] border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`}>
                                firstName → givenName
                            </div>
                            <div className={`px-3 py-1.5 rounded-md border text-xs font-mono ${isDarkMode ? 'bg-[#27272a] border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`}>
                                lastName → familyName
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* OIDC Configuration Details */}
            <section className={`border rounded-xl p-6 ${isDarkMode ? 'bg-[#222225]/50 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className={`text-base font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>OIDC Configuration Details</h3>
                
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Redirect URIs</label>
                        <div className="space-y-2">
                            <div className={`border rounded-lg px-4 py-2.5 text-sm font-mono ${isDarkMode ? 'bg-[#27272a] text-gray-300 border-gray-700' : 'bg-white text-gray-600 border-gray-200'}`}>
                                https://app.example.com/callback
                            </div>
                            <div className={`border rounded-lg px-4 py-2.5 text-sm font-mono ${isDarkMode ? 'bg-[#27272a] text-gray-300 border-gray-700' : 'bg-white text-gray-600 border-gray-200'}`}>
                                https://app.example.com/oauth/return
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Post-logout Redirect URI</label>
                        <div className={`border rounded-lg px-4 py-2.5 text-sm font-mono ${isDarkMode ? 'bg-[#27272a] text-gray-300 border-gray-700' : 'bg-white text-gray-600 border-gray-200'}`}>
                            https://app.example.com/logout
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Grant Types</label>
                        <div className="flex flex-wrap gap-2">
                            <div className={`px-3 py-1.5 rounded-full border text-xs font-medium ${isDarkMode ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                Authorization Code
                            </div>
                            <div className={`px-3 py-1.5 rounded-full border text-xs font-medium ${isDarkMode ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                Refresh Token
                            </div>
                            <div className={`px-3 py-1.5 rounded-full border text-xs font-medium ${isDarkMode ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                Client Credentials
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Scopes</label>
                        <div className="flex flex-wrap gap-2">
                            <div className={`px-3 py-1.5 rounded-full border text-xs font-medium ${isDarkMode ? 'bg-[#27272a] border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`}>
                                openid
                            </div>
                            <div className={`px-3 py-1.5 rounded-full border text-xs font-medium ${isDarkMode ? 'bg-[#27272a] border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`}>
                                profile
                            </div>
                            <div className={`px-3 py-1.5 rounded-full border text-xs font-medium ${isDarkMode ? 'bg-[#27272a] border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`}>
                                email
                            </div>
                            <div className={`px-3 py-1.5 rounded-full border text-xs font-medium ${isDarkMode ? 'bg-[#27272a] border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`}>
                                offline_access
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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
            
            <button 
                onClick={onCreate}
                className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wide transition-all bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
            >
                <Check size={14} />
                Create Connection
            </button>
        </div>

      </div>
    </div>
  );
};
