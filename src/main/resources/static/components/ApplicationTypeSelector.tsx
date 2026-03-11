import React, { useState } from 'react';
import { Key, Shield, Lock, ArrowRight } from 'lucide-react';

interface ApplicationTypeSelectorProps {
  onBack: () => void;
  onSelect: (type: 'oauth' | 'saml' | 'oidc') => void;
}

export const ApplicationTypeSelector: React.FC<ApplicationTypeSelectorProps> = ({ onBack, onSelect }) => {
  const [selectedProtocol, setSelectedProtocol] = useState<'oauth' | 'saml' | 'oidc' | null>(null);

  const handleContinue = () => {
    if (selectedProtocol) {
      onSelect(selectedProtocol);
    }
  };

  const protocols = [
    {
      id: 'oauth',
      name: 'OAuth 2.0',
      icon: Key,
      description: 'Modern authorization protocol for delegated access',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      id: 'saml',
      name: 'SAML 2.0',
      icon: Shield,
      description: 'Enterprise authentication with XML assertions',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      id: 'oidc',
      name: 'OpenID Connect',
      icon: Lock,
      description: 'Identity layer built on OAuth 2.0',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-8 animate-fade-in overflow-y-auto">
      {/* Header */}
      <div className="mb-12">
        <button
          onClick={onBack}
          className="mb-6 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium flex items-center gap-2"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-bold text-white mb-2">Select Authentication Protocol</h1>
        <p className="text-slate-400">Choose the identity provider protocol for your application</p>
      </div>

      {/* Stepper */}
      <div className="mb-12 px-4">
        <div className="relative flex items-center justify-between max-w-2xl mx-auto">
          <div className="absolute left-0 right-0 top-4 h-px bg-gradient-to-r from-slate-700 via-cyan-500/50 to-slate-700 -z-10"></div>
          
          {[
            { num: '1', label: 'Protocol', active: true },
            { num: '2', label: 'Configuration', active: false },
            { num: '3', label: 'Review', active: false }
          ].map((step, idx) => (
            <div key={idx} className="flex flex-col items-center relative z-10">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 ${
                step.active
                  ? 'bg-cyan-600/20 border-cyan-500 text-cyan-400 font-bold'
                  : 'bg-slate-800/50 border-slate-700 text-slate-500'
              }`}>
                {step.num}
              </div>
              <span className={`text-xs font-medium ${step.active ? 'text-cyan-400' : 'text-slate-500'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Protocol Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 flex-1">
        {protocols.map((protocol) => {
          const IconComponent = protocol.icon;
          const isSelected = selectedProtocol === protocol.id;
          
          return (
            <div
              key={protocol.id}
              onClick={() => setSelectedProtocol(protocol.id as 'oauth' | 'saml' | 'oidc')}
              className={`group relative rounded-lg p-6 cursor-pointer transition-all duration-300 backdrop-blur-sm border ${
                isSelected
                  ? 'bg-gradient-to-br from-cyan-600/30 to-cyan-500/20 border-cyan-500 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600'
              }`}
            >
              {/* Background glow effect */}
              <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10 bg-gradient-to-br ${protocol.color}`}></div>
              
              {/* Icon */}
              <div className={`mb-4 flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-700/50 text-slate-400 group-hover:bg-slate-600'
              }`}>
                <IconComponent size={28} />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-white mb-2 transition-colors duration-300">
                {protocol.name}
              </h3>
              <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                {protocol.description}
              </p>

              {/* Selection indicator */}
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-cyan-500/30 flex items-center gap-2 text-cyan-400 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                  Selected
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700/50">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-all duration-300 font-medium"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedProtocol}
          className={`flex items-center gap-2 px-8 py-2 rounded-lg font-medium transition-all duration-300 ${
            selectedProtocol
              ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-cyan-500/30 cursor-pointer'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'
          }`}
        >
          Continue
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
