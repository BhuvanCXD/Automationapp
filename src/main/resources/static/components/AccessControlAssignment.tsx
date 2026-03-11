import React, { useState } from 'react';
import { ShieldCheck, Globe, Users, Search, CheckCircle2, ArrowLeft, LogOut, UserPlus, ChevronRight } from 'lucide-react';

interface AccessControlAssignmentProps {
  onBack: () => void;
  onContinue: (data: any) => void;
}

export const AccessControlAssignment: React.FC<AccessControlAssignmentProps> = ({ onBack, onContinue }) => {
  const [activeTab, setActiveTab] = useState<'groups' | 'nodes' | 'relay'>('groups');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>(['DEVOPS ENGINEERS', 'SECURITY OPS']);

  const toggleGroup = (group: string) => {
    if (selectedGroups.includes(group)) {
      setSelectedGroups(selectedGroups.filter(g => g !== group));
    } else {
      setSelectedGroups([...selectedGroups, group]);
    }
  };

  const groups = [
    { name: 'DEVOPS ENGINEERS', id: 'devops', members: 12 },
    { name: 'SECURITY OPS', id: 'secops', members: 8 },
    { name: 'FRONTEND TEAM', id: 'frontend', members: 15 },
    { name: 'BACKEND SERVICES', id: 'backend', members: 20 },
    { name: 'QA AUTOMATION', id: 'qa', members: 6 },
    { name: 'INFRASTRUCTURE', id: 'infra', members: 9 },
  ];

  const handleContinue = () => {
    onContinue({
      mode: activeTab,
      groups: activeTab === 'groups' ? selectedGroups : (activeTab === 'relay' ? ['Global Relay'] : ['Individual Targets'])
    });
  };

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl animate-fade-in space-y-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest mb-4"
      >
        <ArrowLeft size={16} />
        Back to Config
      </button>

      <div className="space-y-2">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Access Control Assignment</h2>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Define who has access to this application</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-white/5">
        {[
          { id: 'groups', label: 'Groups', icon: <Users size={18} /> },
          { id: 'relay', label: 'Global Relay', icon: <Globe size={18} /> },
          { id: 'nodes', label: 'Nodes', icon: <ShieldCheck size={18} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'groups' | 'nodes' | 'relay')}
            className={`flex items-center gap-3 px-6 py-4 border-b-2 font-bold uppercase tracking-widest text-sm transition-all ${
              activeTab === tab.id
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'groups' && (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search groups..."
              className="w-full bg-slate-950/60 border border-white/5 rounded-2xl pl-16 pr-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder:text-slate-700 font-bold"
            />
          </div>

          {/* Groups Grid */}
          <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto custom-scrollbar">
            {filteredGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => toggleGroup(group.name)}
                className={`p-6 rounded-2xl border-2 transition-all text-left group ${
                  selectedGroups.includes(group.name)
                    ? 'bg-cyan-500/10 border-cyan-500/50'
                    : 'bg-slate-900/30 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`font-black uppercase tracking-tight ${selectedGroups.includes(group.name) ? 'text-cyan-400' : 'text-white'}`}>
                    {group.name}
                  </h3>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    selectedGroups.includes(group.name)
                      ? 'bg-cyan-500 border-cyan-500'
                      : 'border-white/20 group-hover:border-white/40'
                  }`}>
                    {selectedGroups.includes(group.name) && (
                      <CheckCircle2 size={16} className="text-white" strokeWidth={3} />
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{group.members} Members</p>
              </button>
            ))}
          </div>

          <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-6 flex items-center gap-4">
            <UserPlus className="text-cyan-400 flex-shrink-0" size={20} />
            <div>
              <p className="font-black text-white text-sm uppercase">{selectedGroups.length} Groups Selected</p>
              <p className="text-xs text-slate-400 font-bold mt-1">{selectedGroups.join(', ') || 'No groups selected'}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'relay' && (
        <div className="space-y-6">
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-12 text-center space-y-6">
            <Globe className="mx-auto text-indigo-400" size={48} />
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Global Relay Mode</h3>
              <p className="text-sm text-slate-400 font-bold max-w-md mx-auto">All users in the organization will have access to this application</p>
            </div>
            <button 
              onClick={() => {
                onContinue({ mode: 'relay', groups: ['Global Relay'] });
              }}
              className="mx-auto bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 px-10 rounded-2xl uppercase tracking-widest text-sm transition-all shadow-2xl shadow-indigo-600/30"
            >
              Enable Global Access
            </button>
          </div>
        </div>
      )}

      {activeTab === 'nodes' && (
        <div className="space-y-6">
          <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-6 space-y-4">
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Available Nodes</p>
            {['Production Node', 'Staging Node', 'Development Node', 'DR Node'].map((node) => (
              <div key={node} className="flex items-center justify-between p-4 bg-slate-950/40 rounded-xl border border-white/5 hover:border-white/10 group transition-all cursor-pointer">
                <span className="font-bold text-white uppercase tracking-tight">{node}</span>
                <ChevronRight size={20} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-6 pt-4 border-t border-white/5">
        <button 
          onClick={onBack}
          className="flex-1 bg-slate-900/60 hover:bg-slate-900 border border-white/5 text-white font-black py-4 rounded-2xl transition-all uppercase tracking-widest"
        >
          Back
        </button>
        <button 
          onClick={handleContinue}
          disabled={activeTab === 'groups' && selectedGroups.length === 0}
          className="flex-1 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 text-white font-black py-4 rounded-2xl transition-all shadow-2xl shadow-cyan-600/30 uppercase tracking-widest flex items-center justify-center gap-3 group"
        >
          Continue to Review
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
      `}</style>
    </div>
  );
};
