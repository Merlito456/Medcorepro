
import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Stethoscope, 
  Pill, 
  CreditCard, 
  Sparkles, 
  Settings,
  Bell,
  Search,
  Plus,
  LogOut,
  ChevronRight,
  ShieldCheck,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  User,
  ExternalLink,
  WifiOff,
  Trash2
} from 'lucide-react';
import { Module } from './types';
import { ClinicProvider, useClinic } from './ClinicContext';
import DashboardView from './views/DashboardView';
import PatientsView from './views/PatientsView';
import AppointmentsView from './views/AppointmentsView';
import ConsultationView from './views/ConsultationView';
import PharmacyView from './views/PharmacyView';
import BillingView from './views/BillingView';
import AIClinicView from './views/AIClinicView';
import SettingsView from './views/SettingsView';
import LandingView from './views/LandingView';
import Modal from './components/Modal';

const NotificationOverlay: React.FC = () => {
  const { notifications } = useClinic();
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {notifications.map(n => (
        <div key={n.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border animate-in slide-in-from-right-4 duration-300 ${
          n.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
          n.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-800' :
          'bg-blue-50 border-blue-100 text-blue-800'
        }`}>
          {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          {n.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500" />}
          {n.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
          <span className="font-medium text-sm">{n.message}</span>
        </div>
      ))}
    </div>
  );
};

const MainLayout: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeModule, setActiveModule] = useState<Module>(Module.DASHBOARD);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  const { 
    searchTerm, 
    setSearchTerm, 
    notify, 
    isOffline, 
    notificationHistory, 
    clearNotifications,
    markNotificationsRead 
  } = useClinic();

  const unreadCount = notificationHistory.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigation = [
    { id: Module.DASHBOARD, name: 'Dashboard', icon: LayoutDashboard },
    { id: Module.PATIENTS, name: 'Patient Directory', icon: Users },
    { id: Module.APPOINTMENTS, name: 'Schedule', icon: Calendar },
    { id: Module.CONSULTATION, name: 'EMR & Consultation', icon: Stethoscope },
    { id: Module.PHARMACY, name: 'Pharmacy (PNDF)', icon: Pill },
    { id: Module.BILLING, name: 'Billing & PhilHealth', icon: CreditCard },
    { id: Module.AI_CLINIC, name: 'Clinical AI Lab', icon: Sparkles },
    { id: Module.SETTINGS, name: 'Clinic Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeModule) {
      case Module.DASHBOARD: return <DashboardView />;
      case Module.PATIENTS: return <PatientsView />;
      case Module.APPOINTMENTS: return <AppointmentsView />;
      case Module.CONSULTATION: return <ConsultationView />;
      case Module.PHARMACY: return <PharmacyView />;
      case Module.BILLING: return <BillingView />;
      case Module.AI_CLINIC: return <AIClinicView />;
      case Module.SETTINGS: return <SettingsView />;
      default: return <div className="p-8">Module coming soon...</div>;
    }
  };

  const handleSignOut = () => {
    notify('Securely signing out of MedCore PH...', 'info');
    setTimeout(() => {
      onLogout();
    }, 1000);
  };

  const toggleNotifications = () => {
    if (!isNotificationOpen) {
      markNotificationsRead();
    }
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <div className="flex h-full w-full bg-slate-50 animate-in fade-in duration-700">
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-slate-900 text-white transition-all duration-300 flex flex-col h-full z-20`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">M</div>
              <span className="font-bold text-xl tracking-tight">MedCore<span className="text-blue-400">PH</span></span>
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 transition-colors">
            <ChevronRight className={`w-5 h-5 transition-transform ${isSidebarCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive ? 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                {!isSidebarCollapsed && <span className="truncate text-sm">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-3 text-slate-400 hover:bg-rose-900/20 hover:text-rose-400 rounded-xl transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            {!isSidebarCollapsed && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center flex-1 max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search Patient Name, PhilHealth ID..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {isOffline && (
              <div className="ml-4 flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-full text-[10px] font-bold uppercase animate-pulse">
                <WifiOff className="w-3 h-3" />
                Offline Mode
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden lg:block mr-4 border-r border-slate-100 pr-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Clinic Credentials</p>
                <p className="text-xs font-medium text-slate-600">PRC: 0123456 • PTR: 9876543</p>
              </div>
            
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={toggleNotifications}
                className={`p-2.5 rounded-xl transition-all relative ${isNotificationOpen ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-500'}`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[70] animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                    <button 
                      onClick={clearNotifications}
                      className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Clear History
                    </button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notificationHistory.length === 0 ? (
                      <div className="p-12 text-center text-slate-400">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-10" />
                        <p className="text-xs font-medium">No recent activity</p>
                      </div>
                    ) : (
                      notificationHistory.map((n) => (
                        <div key={n.id} className="p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                          <div className="flex gap-3">
                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                              n.type === 'success' ? 'bg-emerald-500' :
                              n.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'
                            }`} />
                            <div className="flex-1">
                              <p className="text-xs text-slate-700 leading-relaxed">{n.message}</p>
                              <p className="text-[9px] text-slate-400 mt-1 font-medium">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-3 px-2 py-1 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group border border-transparent hover:border-slate-200"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 leading-none">Dr. Juan Dela Cruz</p>
                <p className="text-xs text-blue-600 mt-1 flex items-center gap-1 justify-end font-medium">
                  <ShieldCheck className="w-3 h-3" /> PH-Licensed
                </p>
              </div>
              <img src="https://picsum.photos/seed/docph/40/40" alt="Profile" className="w-10 h-10 rounded-xl border border-slate-200 object-cover group-hover:scale-105 transition-transform" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </main>

      <Modal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        title="Physician Profile"
      >
        <div className="space-y-8">
          <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <img src="https://picsum.photos/seed/docph/80/80" className="w-20 h-20 rounded-2xl border-4 border-white shadow-sm" alt="Doctor" />
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Dr. Juan Dela Cruz</h3>
              <p className="text-blue-600 font-medium flex items-center gap-2 mt-1">
                <ShieldCheck className="w-4 h-4" /> Registered Medical Practitioner
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">PRC License</p>
              <p className="font-mono text-lg font-bold text-slate-900">0123456</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">PTR Number</p>
              <p className="font-mono text-lg font-bold text-slate-900">9876543</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">S2 License</p>
              <p className="font-mono text-lg font-bold text-slate-900">S2-2023-XYZ</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Specialization</p>
              <p className="text-lg font-bold text-slate-900">Family Medicine</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => {
                setActiveModule(Module.SETTINGS);
                setIsProfileModalOpen(false);
              }}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <Settings className="w-5 h-5" />
              Manage Clinic Settings
            </button>
            <button 
              onClick={handleSignOut}
              className="w-full py-3 text-rose-600 font-bold hover:bg-rose-50 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Logout Session
            </button>
          </div>
        </div>
      </Modal>

      <NotificationOverlay />
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('medcore_session') === 'active';
  });

  const handleLoginSuccess = () => {
    localStorage.setItem('medcore_session', 'active');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('medcore_session');
    setIsAuthenticated(false);
  };

  return (
    <ClinicProvider>
      {isAuthenticated ? (
        <MainLayout onLogout={handleLogout} />
      ) : (
        <LandingView onLoginSuccess={handleLoginSuccess} />
      )}
    </ClinicProvider>
  );
};

export default App;
