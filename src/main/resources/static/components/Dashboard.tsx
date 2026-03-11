import React, { useState, useEffect } from 'react';
import { Plus, Shield, Activity, Globe, Lock, Search, Filter, LayoutDashboard, Database, Key, ChevronRight, CheckCircle2, Sparkles, Terminal, Zap, LogOut } from 'lucide-react';
import { ApplicationTypeSelector } from './ApplicationTypeSelector';
import { OAuthConfiguration } from './OAuthConfiguration';
import { SAMLConfiguration } from './SAMLConfiguration';
import { ConfigurationReview } from './ConfigurationReview';
import { AccessControlAssignment } from './AccessControlAssignment';
import { TerminalLog } from './TerminalLog';

interface AppRecord {
  id: string;
  name: string;
  type: string;
  endpoint: string;
  status: 'Active' | 'Pending' | 'Offline';
  category: string;
  deployedAt: string;
}

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

type ViewState = 'overview' | 'create' | 'oauth-config' | 'saml-config' | 'access-assignment' | 'review' | 'success';

export const Dashboard: React.FC<DashboardProps> = ({ username, onLogout }) => {
  const [view, setView] = useState<ViewState>('overview');
  const [configData, setConfigData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  
  const [applications, setApplications] = useState<AppRecord[]>([
    {
      id: '1',
      name: 'Cloud Gateway Alpha',
      type: 'OAUTH 2.0',
      endpoint: 'relay.cyberx.io/v1/auth',
      status: 'Active',
      category: 'Network Infrastructure',
      deployedAt: '2024-05-12T10:30:00Z'
    },
    {
      id: '2',
      name: 'Internal HR Portal',
      type: 'SAML 2.0',
      endpoint: 'sso.internal.corp/saml/acs',
      status: 'Active',
      category: 'Business Application',
      deployedAt: '2024-06-01T14:15:00Z'
    }
  ]);

  const handleTypeSelect = (type: 'oauth' | 'saml' | 'other', provider?: string) => {
    setConfigData({ provider: provider });
    if (type === 'oauth') setView('oauth-config');
    else if (type === 'saml') setView('saml-config');
  };

  const handleBackToSelector = () => setView('create');
  
  const handleConfigSubmit = (data: any) => {
    setConfigData((prev: any) => ({ ...(prev || {}), ...data }));
    setView('access-assignment');
  };

  const handleAssignmentSubmit = (assignmentData: any) => {
    setConfigData((prev: any) => ({ ...(prev || {}), assignment: assignmentData }));
    setView('review');
  };

  const handleCommit = () => {
    setIsSubmitting(true);
    setShowTerminal(true);
    setTimeout(() => {
      const newApp: AppRecord = {
        id: Math.random().toString(36).substr(2, 9),
        name: configData?.name || 'Tactical Asset',
        type: configData?.type === 'OAuth' ? 'OAUTH 2.0' : 'SAML 2.0',
        endpoint: configData?.acsUrl || configData?.discoveryUrl || 'internal.sec.relay',
        status: 'Active',
        category: 'Secured Asset',
        deployedAt: new Date().toISOString()
      };
      
      setApplications(prev => [newApp, ...prev]);
      setIsSubmitting(false);
      setView('success');
    }, 2400);
  };

  const handleReturnToDashboard = () => {
    setView('overview');
    setConfigData(null);
    setShowTerminal(false);
  };

  if (view === 'create') return (
    <div className="w-full max-w-[1600px] h-[92vh] flex animate-fade-in bg-slate-950/90 backdrop-blur-2xl rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_0_150px_rgba(0,0,0,0.8)] items-center justify-center">
      <ApplicationTypeSelector onBack={() => setView('overview')} onSelect={handleTypeSelect} />
    </div>
  );

  if (view === 'oauth-config') return (
    <div className="w-full max-w-[1600px] h-[92vh] flex animate-fade-in bg-slate-950/90 backdrop-blur-2xl rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_0_150px_rgba(0,0,0,0.8)] items-center justify-center">
      <OAuthConfiguration onBack={handleBackToSelector} onContinue={handleConfigSubmit} />
    </div>
  );

  if (view === 'saml-config') return (
    <div className="w-full max-w-[1600px] h-[92vh] flex animate-fade-in bg-slate-950/90 backdrop-blur-2xl rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_0_150px_rgba(0,0,0,0.8)] items-center justify-center">
      <SAMLConfiguration onBack={handleBackToSelector} onContinue={handleConfigSubmit} />
    </div>
  );

  if (view === 'access-assignment') return (
    <div className="w-full max-w-[1600px] h-[92vh] flex animate-fade-in bg-slate-950/90 backdrop-blur-2xl rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_0_150px_rgba(0,0,0,0.8)] items-center justify-center">
      <AccessControlAssignment onBack={() => setView(configData?.type === 'SAML 2.0' ? 'saml-config' : 'oauth-config')} onContinue={handleAssignmentSubmit} />
    </div>
  );

  if (view === 'review') return (
    <div className="w-full max-w-[1600px] h-[92vh] flex animate-fade-in bg-slate-950/90 backdrop-blur-2xl rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_0_150px_rgba(0,0,0,0.8)] items-center justify-center">
      <ConfigurationReview data={configData} onBack={() => setView('access-assignment')} onCommit={handleCommit} isSubmitting={isSubmitting} />
    </div>
  );

  if (view === 'success') {
    return (
      <div className="w-full max-w-[1600px] h-[92vh] flex animate-fade-in bg-slate-950/90 backdrop-blur-2xl rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_0_150px_rgba(0,0,0,0.8)] items-center justify-center">
        <div className="text-center p-16 space-y-12">
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_80px_rgba(16,185,129,0.3)]">
              <CheckCircle2 size={64} className="animate-pulse" />
            </div>
            <Zap className="absolute -top-4 -right-4 text-emerald-400 animate-bounce" size={32} />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white tracking-tighter uppercase font-mono">Deployment Success</h2>
            <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed font-medium">
              The secure gateway for <span className="text-emerald-400 font-bold">"{configData?.name}"</span> has been established and is now broadcasting.
            </p>
          </div>

          <button 
            onClick={handleReturnToDashboard}
            className="w-full max-w-sm bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black py-5 rounded-2xl shadow-2xl shadow-emerald-600/20 transition-all active:scale-[0.98] text-base group uppercase tracking-widest"
          >
            Return to Console
            <ChevronRight size={20} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <TerminalLog isOpen={showTerminal} onClose={() => setShowTerminal(false)} />
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div className="w-full max-w-[1600px] h-[92vh] flex animate-fade-in bg-slate-950/90 backdrop-blur-2xl rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_0_150px_rgba(0,0,0,0.8)]">
      
      {/* Tactical Sidebar */}
      <div className="w-80 border-r border-white/5 bg-slate-950 p-10 flex flex-col gap-12 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        
        <div className="flex items-center gap-5 px-2 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 shadow-2xl shadow-cyan-500/30 flex items-center justify-center font-black text-slate-950 text-xl font-mono">Δ</div>
          <div className="flex flex-col">
            <span className="font-black text-white tracking-tighter leading-none text-xl uppercase">CyberxDelta</span>
            <span className="text-[10px] text-cyan-500 font-black tracking-[0.3em] uppercase mt-2 font-mono opacity-80">Security OS v4.1</span>
          </div>
        </div>

        <nav className="flex flex-col gap-3 relative z-10">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active={true} onClick={() => setView('overview')} />
          <SidebarItem icon={<Globe size={20} />} label="Asset Registry" active={false} onClick={() => {}} />
        </nav>

        <div className="flex-1" />

        <button 
          onClick={onLogout}
          className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors font-bold text-sm uppercase tracking-widest px-4 py-3 rounded-xl border border-white/5 hover:border-red-500/20 group"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Command Center */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-950/40">
        <header className="h-28 border-b border-white/5 px-12 flex items-center justify-between bg-slate-950/60 backdrop-blur-3xl z-10">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Command Center</h1>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest font-mono">Authenticated:</span>
              <span className="text-[10px] text-cyan-400 font-black font-mono tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{username}</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search Asset Registry..." 
                className="bg-slate-900 border border-white/5 rounded-2xl pl-14 pr-8 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/40 w-96 transition-all placeholder:text-slate-700 font-bold tracking-tight shadow-inner"
              />
            </div>
            <button 
              onClick={() => setView('create')}
              className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black py-4 px-10 rounded-2xl flex items-center gap-4 text-sm transition-all shadow-2xl shadow-cyan-600/20 active:scale-95 uppercase tracking-widest"
            >
              <Plus size={20} strokeWidth={3} />
              <span>Provision Asset</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar relative">
          {/* Subtle Background Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="space-y-8 relative z-10">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-5">
                <h2 className="text-base font-black text-white uppercase tracking-[0.4em] font-mono">Registry Nodes</h2>
                <div className="px-3 py-1 rounded-lg bg-white/5 text-[10px] text-slate-400 font-black border border-white/5">{applications.length} DETECTED</div>
              </div>
              <button className="text-[10px] font-black text-slate-500 hover:text-white flex items-center gap-3 transition-colors uppercase tracking-[0.2em] bg-white/5 px-4 py-2 rounded-xl border border-white/5 group">
                <Filter size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                <span>Configure Filter</span>
              </button>
            </div>

            <div className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-md">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white/5 text-slate-500 font-black uppercase tracking-[0.3em] border-b border-white/5 font-mono">
                    <th className="px-10 py-6">Asset Profile</th>
                    <th className="px-10 py-6">Identity Protocol</th>
                    <th className="px-10 py-6">Routing Node</th>
                    <th className="px-10 py-6">Health</th>
                    <th className="px-10 py-6 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-white/[0.04] transition-all group cursor-default animate-fade-in">
                      <td className="px-10 py-8 font-bold text-white flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl ${app.type.includes('OAUTH') ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'} border flex items-center justify-center text-[14px] group-hover:scale-110 transition-all uppercase font-black shadow-inner`}>
                          {app.name.substring(0, 2)}
                        </div>
                        <div>
                          <div className="text-base font-black group-hover:text-cyan-400 transition-colors tracking-tighter uppercase">{app.name}</div>
                          <div className="text-[10px] text-slate-500 font-black mt-1.5 uppercase tracking-widest font-mono opacity-60">{app.category}</div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className={`px-4 py-1.5 rounded-lg ${app.type.includes('OAUTH') ? 'bg-cyan-500/5 text-cyan-400 border-cyan-500/20' : 'bg-indigo-500/5 text-indigo-400 border-indigo-500/20'} border text-[10px] font-black tracking-widest font-mono`}>{app.type}</span>
                      </td>
                      <td className="px-10 py-8 text-slate-500 font-mono max-w-[280px] truncate group-hover:text-slate-300 transition-colors">{app.endpoint}</td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className={`w-2.5 h-2.5 rounded-full ${app.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-slate-600'}`} />
                          <span className={`${app.status === 'Active' ? 'text-emerald-400 font-black' : 'text-slate-500'} text-[10px] uppercase tracking-[0.2em] font-mono`}>{app.status}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button className="text-slate-500 hover:text-cyan-400 transition-all flex items-center justify-center ml-auto bg-white/5 hover:bg-cyan-500/10 w-10 h-10 rounded-xl border border-white/5 hover:border-cyan-500/20 shadow-sm group/btn">
                          <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {applications.length === 0 && (
                <div className="p-40 text-center space-y-8">
                  <div className="w-24 h-24 bg-slate-900/60 rounded-[2rem] flex items-center justify-center mx-auto text-slate-700 border border-white/5 shadow-inner">
                    <Database size={48} />
                  </div>
                  <div className="space-y-3">
                    <p className="text-xl font-black text-slate-400 tracking-tight uppercase">Registry Node Offline</p>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto font-black uppercase tracking-widest opacity-80">No tactical assets provisioned. Establish a new gateway connection to begin monitoring.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <TerminalLog isOpen={showTerminal} onClose={() => setShowTerminal(false)} />

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-in; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
};

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl text-sm font-black transition-all duration-500 uppercase tracking-widest ${
      active ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5 border border-transparent'
    }`}
  >
    <span className={`${active ? 'text-cyan-400' : 'text-slate-600'}`}>{icon}</span>
    <span className="tracking-tight">{label}</span>
  </button>
);
