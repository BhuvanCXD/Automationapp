import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Plus, 
  Shapes, 
  Settings, 
  Bell, 
  Search, 
  Filter,
  ArrowUpDown,
  MoreVertical,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  Trash2,
  Terminal,
  Sun,
  Moon
} from 'lucide-react';
import { ApplicationTypeSelector } from './ApplicationTypeSelector';
import { OAuthConfiguration } from './OAuthConfiguration';
import { SAMLConfiguration } from './SAMLConfiguration';
import { OIDCConfiguration } from './OIDCConfiguration';
import { AccessAssignment } from './AccessAssignment';
import { ReviewAndCreate } from './ReviewAndCreate';
import { UserProfile } from './UserProfile';
import { ApplicationOnboardingForm } from './ApplicationOnboardingForm';

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

type ViewState = 'list' | 'create' | 'oauth-config' | 'saml-config' | 'oidc-config' | 'access-assignment' | 'review-create' | 'profile' | 'onboarding';

export const Dashboard: React.FC<DashboardProps> = ({ username, onLogout }) => {
  const [view, setView] = useState<ViewState>('list');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [apps, setApps] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loadingAssets, setLoadingAssets] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingAssets(true);
        // Fetch profile
        const profileRes = await fetch('/api/profile', {
          credentials: 'include',
        });
        if (profileRes.ok) {
          const profile = await profileRes.json();
          setUserProfile(profile);
        }
        
        // Fetch assets
        const assetsRes = await fetch('/api/assets', {
          credentials: 'include',
        });
        if (assetsRes.ok) {
          const assets = await assetsRes.json();
          setApps(assets);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoadingAssets(false);
      }
    };
    
    fetchData();
  }, []);

  const handleDelete = (id: number) => {
    setApps(apps.filter(app => app.id !== id));
  };

  const handleTypeSelect = (type: string) => {
    if (type === 'oauth') {
      setView('oauth-config');
    } else if (type === 'saml') {
      setView('saml-config');
    } else if (type === 'oidc') {
      setView('oidc-config');
    }
  };

  const handleOAuthBack = () => setView('create');
  const handleOAuthContinue = () => setView('access-assignment');
  const handleAccessBack = () => setView('create'); // Or previous step
  const handleAccessContinue = () => setView('review-create');
  const handleReviewBack = () => setView('access-assignment');
  const handleReviewCreate = () => setView('list');

  // Sidebar Component
  const Sidebar = () => (
    <aside 
      className={`hidden md:flex flex-col border-r py-6 px-4 h-full relative z-20 transition-all duration-300 ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      } ${isDarkMode ? 'bg-[#18181b] border-white/5' : 'bg-white border-gray-200'}`}
    >
      
      {/* Logo */}
      <div className={`flex items-center gap-3 mb-10 px-2 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
          <div className={`w-8 h-8 rounded flex items-center justify-center shadow-lg shrink-0 ${isDarkMode ? 'bg-white shadow-white/10' : 'bg-blue-600 shadow-blue-600/20'}`}>
             <Terminal size={20} className={isDarkMode ? "text-black" : "text-white"} />
          </div>
          {!isSidebarCollapsed && (
            <span className={`font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>CyberXDelta</span>
          )}
      </div>
      
      {/* Navigation */}
      <div className="flex-1 space-y-2">
        <SidebarItem 
          icon={<LayoutGrid size={20} />} 
          label="Home" 
          active={view === 'list'} 
          onClick={() => setView('list')}
          collapsed={isSidebarCollapsed}
          isDarkMode={isDarkMode}
        />
        <SidebarItem 
          icon={<Plus size={20} />} 
          label="Create New App" 
          active={view === 'onboarding' || view === 'create' || view === 'oauth-config'}
          onClick={() => setView('onboarding')}
          collapsed={isSidebarCollapsed}
          isDarkMode={isDarkMode}
        />
        <SidebarItem 
          icon={<Shapes size={20} />} 
          label="My Applications" 
          active={false}
          collapsed={isSidebarCollapsed}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Bottom Settings */}
      <div className="pt-6 mt-auto">
        {!isSidebarCollapsed && (
          <div className={`px-3 text-xs font-semibold mb-4 uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Settings</div>
        )}
        
        <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isSidebarCollapsed 
                ? 'justify-center px-2' 
                : ''
            } ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
            title={isSidebarCollapsed ? (isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode") : undefined}
        >
            <span className={`shrink-0 transition-colors ${isDarkMode ? 'group-hover:text-white' : 'group-hover:text-gray-900'}`}>
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </span>
            {!isSidebarCollapsed && (
                <>
                    <span className="text-sm tracking-wide flex-1 text-left">Dark Mode</span>
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${isDarkMode ? 'left-[18px]' : 'left-0.5'}`}></div>
                    </div>
                </>
            )}
        </button>

         <SidebarItem 
          icon={<Settings size={20} />} 
          label="Settings" 
          active={false}
          collapsed={isSidebarCollapsed}
          isDarkMode={isDarkMode}
        />
        
        {/* Collapse Toggle */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={`w-full flex items-center justify-center mt-4 p-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
        >
          {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </aside>
  );

  // Header Component (Top Right)
  const Header = () => (
     <div 
       className={`flex items-center justify-end h-16 px-8 gap-6 fixed top-0 right-0 z-30 backdrop-blur-md border-b transition-all duration-300 ${
         isSidebarCollapsed ? 'w-[calc(100%-5rem)]' : 'w-[calc(100%-16rem)]'
       } ${isDarkMode ? 'bg-[#020617]/90 border-white/5' : 'bg-white/90 border-gray-200'}`}
     >
        <div className="flex items-center gap-6">
            <button className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors relative`}>
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-black"></span>
            </button>
            <div 
                className={`w-9 h-9 rounded-full overflow-hidden border cursor-pointer transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 hover:border-gray-400' : 'bg-gray-200 border-gray-300 hover:border-gray-400'}`}
                onClick={() => setView('profile')}
                title={`Logged in as ${username}. Click to view profile.`}
            >
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="User" 
                  className="w-full h-full object-cover" 
                />
            </div>
        </div>
     </div>
  );

  // List View Content
  const renderListView = () => (
      <div className="p-4 md:p-6 pt-32 animate-fade-in max-w-[98%] mx-auto w-full">
          
          {/* Table Section */}
          <div className="space-y-4">
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Applications</h3>
              
              {/* Toolbar */}
              <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 p-2 rounded-lg border shadow-lg ${isDarkMode ? 'bg-[#222225] border-white/5' : 'bg-white border-gray-200'}`}>
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                      {/* Search */}
                      <div className="relative flex-grow md:flex-grow-0 md:w-80">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Search size={16} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                          </div>
                          <input 
                              type="text" 
                              placeholder="Search" 
                              className={`text-sm rounded-md block w-full pl-10 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium ${isDarkMode ? 'bg-white text-gray-900 placeholder-gray-500' : 'bg-gray-50 text-gray-900 placeholder-gray-500 border border-gray-200'}`}
                          />
                      </div>
                      
                      {/* Filter */}
                      <button className={`flex items-center gap-2 px-3 py-2 bg-transparent border rounded-md text-sm font-medium transition-colors ${isDarkMode ? 'border-gray-600 text-gray-300 hover:text-white hover:border-gray-400' : 'border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 hover:bg-gray-50'}`}>
                          <Filter size={14} />
                          Filter
                      </button>

                       {/* Sort */}
                       <button className={`flex items-center gap-2 px-3 py-2 bg-transparent border rounded-md text-sm font-medium transition-colors ${isDarkMode ? 'border-gray-600 text-gray-300 hover:text-white hover:border-gray-400' : 'border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 hover:bg-gray-50'}`}>
                          <ArrowUpDown size={14} />
                          Sort
                      </button>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                       <button className={`flex items-center gap-2 px-3 py-2 text-sm font-medium ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                           Customise columns
                           <ChevronDown size={14} />
                       </button>
                       <button className={`p-2 rounded transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
                           <MoreVertical size={18} />
                       </button>
                  </div>
              </div>

              {/* Table */}
              <div className={`border rounded-lg overflow-hidden ${isDarkMode ? 'border-gray-700 bg-[#18181b]' : 'border-gray-200 bg-white'}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className={`border-b ${isDarkMode ? 'bg-[#27272a] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                                <th className={`py-3 px-6 text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>App Name</th>
                                <th className={`py-3 px-6 text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Protocol</th>
                                <th className={`py-3 px-6 text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Provider</th>
                                <th className={`py-3 px-6 text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>status</th>
                                <th className={`py-3 px-6 text-xs font-medium uppercase tracking-wider text-right pr-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {apps && apps.length > 0 ? apps.map((app) => (
                                <tr key={app.id} className={`transition-colors group cursor-pointer ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                                    <td className={`py-3 px-6 text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{app.applicationName}</td>
                                    <td className={`py-3 px-6 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{app.protocol}</td>
                                    <td className={`py-3 px-6 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{app.identityProvider}</td>
                                    <td className="py-3 px-6">
                                        <StatusPill status="Active" />
                                    </td>
                                    <td className="py-3 px-6">
                                        <div className={`flex items-center justify-end gap-3 pr-4 opacity-70 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            <button className="hover:text-blue-400 transition-colors" title="View Details"><Eye size={16} /></button>
                                            <button className="hover:text-yellow-400 transition-colors" title="Edit"><Edit2 size={16} /></button>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(app.id);
                                                }}
                                                className="hover:text-red-400 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className={`py-8 px-6 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        No applications yet. Click "Create New App" to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  <div className={`border-t px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 ${isDarkMode ? 'bg-[#222225] border-gray-700' : 'bg-white border-gray-200'}`}>
                      <div className={`flex items-center gap-6 text-xs ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                          <span className="font-medium">1-10 of 234</span>
                          <div className="flex items-center gap-2">
                              <button className={`p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}><ChevronLeft size={16} /></button>
                              <button className={`p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}><ChevronRight size={16} /></button>
                          </div>
                      </div>
                      <div className={`flex items-center gap-3 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <span>No of rows</span>
                          <div className={`flex items-center gap-2 cursor-pointer font-medium px-2 py-1 rounded transition-colors ${isDarkMode ? 'text-white hover:bg-white/5' : 'text-gray-900 hover:bg-gray-100'}`}>
                              <span>10</span>
                              <ChevronDown size={14} />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderContent = () => {
    if (view === 'create') {
        return (
            <div className="h-full pt-28 flex flex-col w-full overflow-hidden">
                 <ApplicationTypeSelector onBack={() => setView('list')} onSelect={handleTypeSelect} isDarkMode={isDarkMode} />
            </div>
        );
    }
    if (view === 'oauth-config') {
        return (
            <div className="p-8 pt-32 flex justify-center w-full">
                 <OAuthConfiguration onBack={handleOAuthBack} onContinue={handleOAuthContinue} isDarkMode={isDarkMode} />
            </div>
        );
    }
    if (view === 'saml-config') {
        return (
            <div className="h-full pt-28 flex flex-col w-full overflow-hidden">
                 <SAMLConfiguration onBack={handleOAuthBack} onContinue={handleOAuthContinue} isDarkMode={isDarkMode} />
            </div>
        );
    }
    if (view === 'oidc-config') {
        return (
            <div className="h-full pt-28 flex flex-col w-full overflow-hidden">
                 <OIDCConfiguration onBack={handleOAuthBack} onContinue={handleOAuthContinue} isDarkMode={isDarkMode} />
            </div>
        );
    }
    if (view === 'access-assignment') {
        return (
            <div className="h-full pt-28 flex flex-col w-full overflow-hidden">
                 <AccessAssignment onBack={handleAccessBack} onContinue={handleAccessContinue} isDarkMode={isDarkMode} />
            </div>
        );
    }
    if (view === 'review-create') {
        return (
            <div className="h-full pt-28 flex flex-col w-full overflow-hidden">
                 <ReviewAndCreate onBack={handleReviewBack} onCreate={handleReviewCreate} isDarkMode={isDarkMode} />
            </div>
        );
    }
    if (view === 'profile') {
        return (
            <div className="h-full w-full overflow-y-auto">
                 <UserProfile username={username} onBack={() => setView('list')} onLogout={onLogout} isDarkMode={isDarkMode} />
            </div>
        );
    }
    if (view === 'onboarding') {
        return (
            <div className="p-8 pt-32 flex justify-center w-full">
                 <ApplicationOnboardingForm 
                    onBack={() => setView('list')} 
                    onSuccess={() => {
                        setView('list');
                        fetch('/api/assets', { credentials: 'include' })
                            .then(res => res.json())
                            .then(data => setApps(data))
                            .catch(err => console.error('Failed to refresh assets:', err));
                    }}
                    isDarkMode={isDarkMode}
                 />
            </div>
        );
    }
    return renderListView();
  };

  return (
    <div className={`flex h-full w-full font-sans ${isDarkMode ? 'bg-[#09090b] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto relative scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        <Header />
        {renderContent()}
      </main>
    </div>
  );
};

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick?: () => void; collapsed?: boolean; isDarkMode?: boolean }> = ({ icon, label, active, onClick, collapsed, isDarkMode = true }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
      active 
        ? (isDarkMode ? 'bg-[#f4f4f5] text-black font-semibold shadow-md shadow-white/5' : 'bg-blue-50 text-blue-600 font-semibold')
        : (isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100')
    } ${collapsed ? 'justify-center px-2' : ''}`}
    title={collapsed ? label : undefined}
  >
    <span className={`${active ? (isDarkMode ? 'text-black' : 'text-blue-600') : (isDarkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-900')} transition-colors shrink-0`}>
      {icon}
    </span>
    {!collapsed && (
      <span className="text-sm tracking-wide whitespace-nowrap overflow-hidden">{label}</span>
    )}
  </button>
);

const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  let classes = "bg-gray-800 text-gray-400";
  
  // Style based on screenshot pill design
  if (status === 'Compliant' || status === 'Active') {
      classes = "bg-[#dcfce7] text-[#15803d]"; // Green background, Green text
  } else if (status === 'Draft') {
      classes = "bg-[#fef9c3] text-[#854d0e]"; // Yellow
  } else if (status === 'Non-Compliant' || status === 'Disabled') {
      classes = "bg-[#fee2e2] text-[#991b1b]"; // Red
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold ${classes}`}>
      {status}
    </span>
  );
};
