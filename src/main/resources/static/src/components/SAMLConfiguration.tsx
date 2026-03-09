import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Trash2, HelpCircle, ChevronDown, ExternalLink } from 'lucide-react';

interface SAMLConfigurationProps {
  onBack: () => void;
  onContinue: () => void;
  isDarkMode?: boolean;
}

export const SAMLConfiguration: React.FC<SAMLConfigurationProps> = ({ onBack, onContinue, isDarkMode = true }) => {
  const [attributes, setAttributes] = useState([
    { id: 1, idpAttr: 'groups', spAttr: 'memberOf' },
    { id: 2, idpAttr: 'firstName', spAttr: 'givenName' },
    { id: 3, idpAttr: 'lastName', spAttr: 'sn' },
  ]);

  const handleDeleteAttribute = (id: number) => {
    setAttributes(attributes.filter(attr => attr.id !== id));
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
            <h2 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>SAML Settings</h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Configure the SAML-specific settings for your new application.</p>
        </div>

        {/* Card Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            
            {/* Core Configuration */}
            <section className="space-y-5">
                <h3 className={`text-lg font-bold border-b pb-2 ${isDarkMode ? 'text-white border-white/5' : 'text-gray-900 border-gray-200'}`}>Core SAML Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Application Name */}
                    <div className="space-y-1.5">
                        <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Application Name
                        </label>
                        <input 
                            type="text" 
                            placeholder="My Enterprise Portal"
                            className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm transition-all ${isDarkMode ? 'bg-[#27272a] text-white border-gray-700 hover:border-gray-600 placeholder-gray-600' : 'bg-white text-gray-900 border-gray-300 hover:border-gray-400 placeholder-gray-400'}`}
                        />
                    </div>

                    {/* Entity ID */}
                    <div className="space-y-1.5">
                        <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Entity ID
                        </label>
                        <input 
                            type="text" 
                            placeholder="https://sp.example.com/saml/metadata"
                            className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm transition-all ${isDarkMode ? 'bg-[#27272a] text-white border-gray-700 hover:border-gray-600 placeholder-gray-600' : 'bg-white text-gray-900 border-gray-300 hover:border-gray-400 placeholder-gray-400'}`}
                        />
                    </div>

                    {/* ACS URL */}
                    <div className="space-y-1.5">
                        <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Assertion Consumer Service (ACS) URL
                        </label>
                        <input 
                            type="text" 
                            placeholder="https://sp.example.com/saml/acs"
                            className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm transition-all ${isDarkMode ? 'bg-[#27272a] text-white border-gray-700 hover:border-gray-600 placeholder-gray-600' : 'bg-white text-gray-900 border-gray-300 hover:border-gray-400 placeholder-gray-400'}`}
                        />
                    </div>

                    {/* NameID Format */}
                    <div className="space-y-1.5">
                        <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            NameID Format
                        </label>
                        <div className="relative">
                            <select 
                                className={`w-full border rounded-lg px-4 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm transition-all ${isDarkMode ? 'bg-[#27272a] text-white border-gray-700 hover:border-gray-600' : 'bg-white text-gray-900 border-gray-300 hover:border-gray-400'}`}
                            >
                                <option value="email">EmailAddress</option>
                                <option value="unspecified">Unspecified</option>
                                <option value="persistent">Persistent</option>
                                <option value="transient">Transient</option>
                            </select>
                            <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} size={16} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Attribute Mapping */}
            <section className="space-y-5">
                <h3 className={`text-lg font-bold border-b pb-2 ${isDarkMode ? 'text-white border-white/5' : 'text-gray-900 border-gray-200'}`}>Attribute Mapping</h3>
                
                <div className={`border rounded-lg overflow-hidden ${isDarkMode ? 'border-gray-700 bg-[#18181b]' : 'border-gray-200 bg-white'}`}>
                    <div className={`grid grid-cols-12 border-b py-3 px-4 ${isDarkMode ? 'bg-[#27272a] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                        <div className={`col-span-5 text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>IDP Attribute</div>
                        <div className={`col-span-6 text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>SP Attribute</div>
                        <div className={`col-span-1 text-xs font-medium uppercase tracking-wider text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Actions</div>
                    </div>
                    
                    <div className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                        {attributes.map((attr) => (
                            <div key={attr.id} className={`grid grid-cols-12 py-3 px-4 items-center gap-4 transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                                <div className="col-span-5">
                                    <input 
                                        type="text" 
                                        defaultValue={attr.idpAttr}
                                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm ${isDarkMode ? 'bg-[#222225] text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`}
                                    />
                                </div>
                                <div className="col-span-6">
                                    <input 
                                        type="text" 
                                        defaultValue={attr.spAttr}
                                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm ${isDarkMode ? 'bg-[#222225] text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`}
                                    />
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <button 
                                        onClick={() => handleDeleteAttribute(attr.id)}
                                        className={`transition-colors p-2 rounded ${isDarkMode ? 'text-gray-500 hover:text-red-400 hover:bg-white/5' : 'text-gray-400 hover:text-red-600 hover:bg-gray-100'}`}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className={`p-3 border-t ${isDarkMode ? 'bg-[#222225] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                        <button className="text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wide flex items-center gap-2">
                            + Add Attribute
                        </button>
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
            
            <div className="flex items-center gap-6">
                <a href="#" className="hidden md:flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    Need help? View SAML setup guide
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
