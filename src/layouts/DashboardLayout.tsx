import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Award, 
  Users, 
  UserPlus, 
  FileText, 
  BrainCircuit, 
  ShieldAlert, 
  BarChart3, 
  LogOut, 
  Menu, 
  X, 
  User as UserIcon,
  Bell,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { useWebSocket } from '../hooks/useWebSocket';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
}

export function DashboardLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { toasts, addToast, removeToast } = useToastStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const ws = useWebSocket();

  // Define sidebar links per role
  const sidebarItems: Record<string, SidebarItem[]> = {
    Employee: [
      { name: 'Courses', path: '/courses', icon: BookOpen },
      { name: 'Certificates', path: '/certificates', icon: Award },
    ],
    Manager: [
      { name: 'Team Compliance', path: '/team-compliance', icon: Users },
      { name: 'Assign Courses', path: '/assign-courses', icon: UserPlus },
    ],
    ContentAdmin: [
      { name: 'Course Management', path: '/course-management', icon: FileText },
      { name: 'AI Quiz Generator', path: '/ai-quiz-generator', icon: BrainCircuit },
    ],
    HRAdmin: [
      { name: 'Company Compliance', path: '/company-compliance', icon: ShieldAlert },
      { name: 'Reports', path: '/reports', icon: BarChart3 },
    ],
  };

  const userRole = user?.role || 'Employee';
  const links = sidebarItems[userRole] || [];

  // Listen for the WebSocket certificate_issued event
  useEffect(() => {
    if (user?.role === 'Manager') {
      const handleCertificateIssued = (data: { employeeName: string; courseName: string }) => {
        addToast(
          `Team member ${data.employeeName} just completed ${data.courseName}`,
          'success',
          5000
        );
      };

      ws.on('certificate_issued', handleCertificateIssued);

      return () => {
        ws.off('certificate_issued', handleCertificateIssued);
      };
    }
  }, [userRole, ws]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to trigger a mock websocket notification event for testing
  const triggerMockNotification = () => {
    const mockEvents = [
      { employeeName: 'Sarah Jenkins', courseName: 'SOC2 Cybersecurity Compliance' },
      { employeeName: 'David Chen', courseName: 'Anti-Bribery & Corruption Conduct' },
      { employeeName: 'Amanda Ross', courseName: 'HIPAA Data Privacy Regulations' },
    ];
    const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
    
    // Simulate receiving it via websocket by calling store directly,
    // or trigger client emit if testing socket.io loopback
    addToast(
      `Team member ${randomEvent.employeeName} just completed ${randomEvent.courseName}`,
      'success',
      5000
    );
  };

  return (
    <div className="min-h-screen bg-nexara-bg flex flex-col md:flex-row relative">
      
      {/* Dynamic Toast Notifications Popup */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
        {toasts.map((toast) => {
          const Icon = {
            success: CheckCircle2,
            warning: AlertTriangle,
            danger: XCircle,
            info: Info
          }[toast.type];

          const colorClasses = {
            success: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200',
            warning: 'bg-amber-950/80 border-amber-500/50 text-amber-200',
            danger: 'bg-rose-950/80 border-rose-500/50 text-rose-200',
            info: 'bg-sky-950/80 border-sky-500/50 text-sky-200'
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`p-4 rounded-xl border backdrop-blur-md shadow-2xl flex items-start gap-3 pointer-events-auto animate-toast ${colorClasses}`}
            >
              <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1 text-sm font-medium">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-nexara-navy/40 border-r border-slate-800/80 backdrop-blur-xl p-6">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-nexara-accent to-nexara-light flex items-center justify-center font-bold text-slate-900">
            SF
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              SkillForge
            </h1>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
              Nexara Group
            </span>
          </div>
        </div>

        {/* Dynamic Sidebar Links */}
        <nav className="flex-1 space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-nexara-accent/20 text-nexara-light border-l-4 border-nexara-accent'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* User profile footer */}
        <div className="border-t border-slate-800/60 pt-4 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-nexara-light border border-slate-700">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-500 capitalize">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-950/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile Toggle Menu */}
      <div className="md:hidden bg-nexara-navy/90 border-b border-slate-850 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-nexara-accent flex items-center justify-center font-bold text-slate-900 text-sm">
            SF
          </div>
          <span className="font-bold text-white">SkillForge</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded text-slate-400 hover:text-white focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-14 left-0 w-full bg-nexara-navy/95 border-b border-slate-800/80 backdrop-blur-2xl z-40 flex flex-col p-4 space-y-2 animate-slide-in">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-nexara-accent/20 text-nexara-light' : 'text-slate-400 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            );
          })}
          <div className="border-t border-slate-800/60 pt-4 flex flex-col gap-2">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-nexara-light">
                <UserIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-950/20"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto max-h-screen">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-850 px-6 flex items-center justify-between bg-nexara-dark/20 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700/60 text-slate-300 font-medium">
              Role: <strong className="text-nexara-light font-semibold">{user?.role}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* If Manager, show a mock websocket emitter trigger button */}
            {user?.role === 'Manager' && (
              <button
                onClick={triggerMockNotification}
                className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-nexara-light font-medium py-1.5 px-3 rounded-lg transition-all"
                title="Mock a WebSockets client event trigger for certificate completion"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Simulate WS Certificate Event
              </button>
            )}

            <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/40 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-nexara-accent animate-pulse"></span>
            </button>
            
            <div className="h-4 w-px bg-slate-850"></div>
            
            <span className="text-sm font-medium text-slate-300 hidden sm:inline">{user?.name}</span>
          </div>
        </header>

        {/* Nested Routes Router Outlet */}
        <main className="flex-1 p-6 md:p-8 animate-slide-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
