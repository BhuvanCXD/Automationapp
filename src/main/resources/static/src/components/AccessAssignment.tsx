import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Users, UserCheck, Check, ExternalLink } from 'lucide-react';

interface AccessAssignmentProps {
  onBack: () => void;
  onContinue: () => void;
  isDarkMode?: boolean;
}

export const AccessAssignment: React.FC<AccessAssignmentProps> = ({ onBack, onContinue, isDarkMode = true }) => {
  const [accessPolicy, setAccessPolicy] = useState('selected-groups');
  const [selectedGroups, setSelectedGroups] = useState<string[]>(['Engineering']);

  const policies = [
    {
      id: 'selected-groups',
      title: 'Assign to selected groups only',
      description: 'Only users belonging to the chosen groups will have access.',
      icon: <Users size={20} />
    },
    {
      id: 'everyone',
      title: 'Allow anyone in company',
      description: 'All authenticated users within the organization will have access.',
      icon: <ShieldCheck size={20} />
    },
    {
      id: 'admin-approval',
      title: 'Require IAM Admin approval',
      description: 'Access requests will be routed to an IAM administrator for manual review and approval.',
      icon: <UserCheck size={20} />
    }
  ];

  const groups = [
    'Engineering',
    'HR Team',
    'Finance',
    'Sales',
    'Product Management'
  ];

  const toggleGroup = (group: string) => {
    if (selectedGroups.includes(group)) {
      setSelectedGroups(selectedGroups.filter(g => g !== group));
    } else {
      setSelectedGroups([...selectedGroups, group]);
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
              
              {/* Step 2 - Completed */}
              <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs mb-2 z-10 shadow-[0_0_10px_rgba(59,130,246,0.2)] ${isDarkMode ? 'bg-[#1e293b] border-blue-500/50 text-blue-400' : 'bg-blue-50 border-blue-500 text-blue-600'}`}>2</div>
                  <span className={`text-xs font-medium tracking-wide ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Configuration</span>
              </div>

              {/* Step 3 - Active */}
              <div className="relative flex flex-col items-center">
                  <div className="absolute -inset-4 bg-blue-500/5 rounded-xl border border-blue-500/10 -z-10"></div>
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs mb-2 shadow-lg z-10 ${isDarkMode ? 'bg-[#1e293b] border-blue-500/30 text-white shadow-blue-900/20' : 'bg-blue-600 border-blue-600 text-white shadow-blue-500/30'}`}>3</div>
                  <span className={`text-xs font-semibold tracking-wide ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Access & Assignment</span>
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
            <h2 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Access & Assignment</h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Who should have access to this application?</p>
        </div>

        {/* Card Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            
            {/* Access Policy Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded bg-blue-500/10 text-blue-400">
                        <ShieldCheck size={16} />
                    </div>
                    <div>
                        <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Access Policy</h3>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Choose how access is granted</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {policies.map((policy) => (
                        <button
                            key={policy.id}
                            onClick={() => setAccessPolicy(policy.id)}
                            className={`relative text-left p-4 rounded-xl border transition-all duration-200 h-full flex flex-col ${
                                accessPolicy === policy.id
                                ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                                : (isDarkMode 
                                    ? 'bg-[#222225] border-white/5 hover:border-white/10 hover:bg-[#27272a]' 
                                    : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50')
                            }`}
                        >
                            <div className={`mb-3 ${accessPolicy === policy.id ? 'text-blue-400' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}`}>
                                {policy.icon}
                            </div>
                            <h4 className={`text-sm font-bold mb-2 ${accessPolicy === policy.id ? (isDarkMode ? 'text-blue-100' : 'text-blue-700') : (isDarkMode ? 'text-white' : 'text-gray-900')}`}>
                                {policy.title}
                            </h4>
                            <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {policy.description}
                            </p>
                        </button>
                    ))}
                </div>
            </section>

            {/* Select Groups Section - Only visible if 'selected-groups' is active */}
            {accessPolicy === 'selected-groups' && (
                <section className="space-y-4 animate-fade-in">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded bg-purple-500/10 text-purple-400">
                            <Users size={16} />
                        </div>
                        <div>
                            <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Select Groups</h3>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Choose which groups will have access to this application</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {groups.map((group) => {
                            const isSelected = selectedGroups.includes(group);
                            return (
                                <button
                                    key={group}
                                    onClick={() => toggleGroup(group)}
                                    className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                                        isSelected
                                        ? (isDarkMode ? 'bg-blue-500/10 border-blue-500/50 text-white' : 'bg-blue-50 border-blue-500 text-blue-700')
                                        : (isDarkMode ? 'bg-[#222225] border-white/5 text-gray-300 hover:border-white/10 hover:bg-[#27272a]' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50')
                                    }`}
                                >
                                    <span className="text-sm font-medium">{group}</span>
                                    {isSelected && (
                                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                                            <Check size={12} className="text-white" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </section>
            )}

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
                    Need help? View access guide
                    <ExternalLink size={12} />
                </a>
                
                <button 
                    onClick={onContinue}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wide transition-all bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                >
                    Continue to Review
                    <ArrowRight size={14} />
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};
