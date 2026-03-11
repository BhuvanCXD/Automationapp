import React from 'react';
import { CheckCircle2, AlertCircle, Code2, Shield, FileCode, ChevronRight, Zap, Lock, Globe } from 'lucide-react';

interface ConfigurationReviewProps {
  data: any;
  onBack: () => void;
  onCommit: () => void;
  isSubmitting?: boolean;
}

export const ConfigurationReview: React.FC<ConfigurationReviewProps> = ({ data, onBack, onCommit, isSubmitting = false }) => {
  const getIconForType = (type: string) => {
    if (type.includes('OAuth')) return <Globe size={20} className="text-cyan-400" />;
    if (type.includes('SAML')) return <Shield size={20} className="text-indigo-400" />;
    return <Lock size={20} className="text-cyan-400" />;
  };

  const getColorForType = (type: string) => {
    if (type.includes('OAuth')) return 'cyan';
    if (type.includes('SAML')) return 'indigo';
    return 'cyan';
  };

  const color = getColorForType(data?.type || '');

  return (
    <div className="w-full max-w-4xl animate-fade-in space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Final Review</h2>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Verify all configuration details before deployment</p>
      </div>

      <div className={`bg-gradient-to-r from-${color}-500/10 to-transparent border border-${color}-500/20 rounded-3xl p-8 space-y-6`}>
        {/* Application Info */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Application</p>
            <p className="text-2xl font-black text-white break-words">{data?.name || 'Unnamed'}</p>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Protocol</p>
            <div className="flex items-center gap-3">
              {getIconForType(data?.type || '')}
              <span className="text-lg font-black text-white uppercase">{data?.type || 'Unknown'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Details */}
      <div className="space-y-6">
        <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
          <Code2 size={18} className="text-cyan-400" />
          Configuration Details
        </h3>

        <div className="grid grid-cols-2 gap-6">
          {data?.entityId && (
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Entity ID</p>
              <p className="text-sm font-bold text-white font-mono break-words">{data.entityId}</p>
            </div>
          )}

          {data?.discoveryUrl && (
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Discovery URL</p>
              <p className="text-sm font-bold text-white font-mono break-words">{data.discoveryUrl}</p>
            </div>
          )}

          {data?.clientId && (
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Client ID</p>
              <p className="text-sm font-bold text-white font-mono break-words">{data.clientId}</p>
            </div>
          )}

          {data?.acsUrl && (
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">ACS URL</p>
              <p className="text-sm font-bold text-white font-mono break-words">{data.acsUrl}</p>
            </div>
          )}

          {data?.redirectUri && (
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Redirect URI</p>
              <p className="text-sm font-bold text-white font-mono break-words">{data.redirectUri}</p>
            </div>
          )}

          {data?.scopes && (
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Scopes</p>
              <p className="text-sm font-bold text-white break-words">{Array.isArray(data.scopes) ? data.scopes.join(', ') : data.scopes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Access Control Summary */}
      {data?.assignment && (
        <div className="space-y-6 border-t border-white/5 pt-8">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
            <Shield size={18} className="text-emerald-400" />
            Access Control
          </h3>

          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Assignment Mode</p>
            <p className="text-lg font-black text-white uppercase">{data.assignment.mode?.replace('all', 'Universal') || 'Not Specified'}</p>
            
            {data.assignment.groups && (
              <div className="mt-6 space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Groups</p>
                <div className="flex flex-wrap gap-2">
                  {data.assignment.groups.map((group: string, idx: number) => (
                    <span key={idx} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold uppercase">
                      {group}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Validation Check */}
      <div className="flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
        <CheckCircle2 className="text-emerald-400 flex-shrink-0" size={24} />
        <div className="flex-1">
          <p className="font-black text-white text-sm uppercase">Configuration Validated</p>
          <p className="text-xs text-slate-400 font-bold mt-1">All required fields populated and syntax verified</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-6 pt-4">
        <button 
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 bg-slate-900/60 hover:bg-slate-900 disabled:opacity-60 border border-white/5 text-white font-black py-4 rounded-2xl transition-all uppercase tracking-widest"
        >
          Review Again
        </button>
        <button 
          onClick={onCommit}
          disabled={isSubmitting}
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-black py-4 rounded-2xl transition-all shadow-2xl shadow-emerald-600/30 uppercase tracking-widest flex items-center justify-center gap-3 group"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Deploying...
            </>
          ) : (
            <>
              Deploy Configuration
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
