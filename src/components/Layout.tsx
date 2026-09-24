import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Shield, Search, Terminal } from 'lucide-react';
import { api } from '../services/api';
import secoraLogo from '../assets/secora-logo.png';
import secoraFoliage from '../assets/secora-foliage.jpg';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; role: string; profile_image?: string; full_name?: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    api.getSession()
      .then(res => {
        if (res.authenticated) {
          setUser({
            username: res.username,
            role: res.role,
            profile_image: res.profile_image,
            full_name: res.full_name
          });
          setAuthChecked(true);
        } else {
          navigate('/login');
        }
      })
      .catch(() => {
        navigate('/login');
      });
  }, [navigate, location.pathname]);

  const handleLogout = async () => {
    try {
      await api.logout();
      navigate('/login');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navItems = [
    { label: "Overview", path: "/dashboard", index: "01" },
    { label: "Reconnaissance", path: "/reconnaissance", index: "02" },
    { label: "Intelligence", path: "/intelligence", index: "03" },
    { label: "Scan History", path: "/history", index: "04" },
    { label: "Reports", path: "/reports", index: "05" },
    { label: "Settings", path: "/settings", index: "06" },
  ];

  const getHeaderTitle = () => {
    const active = navItems.find(item => location.pathname === item.path || location.pathname.startsWith(item.path + '/'));
    return active ? active.label.toUpperCase() : "SECORA PLATFORM";
  };

  // Show loading spinner while session is being verified
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#06100e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin"></div>
          <span className="font-mono text-[10px] text-emerald-400/80 uppercase tracking-widest">VERIFYING ANALYST SESSION...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06100e] flex text-white font-body selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component with Obsidian Frosted Glass & Emerald Undertones */}
      <aside 
        className={`fixed left-0 top-0 h-full w-72 bg-[#071310]/95 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-white/10 bg-[#071310] justify-between">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <img 
              src={secoraLogo} 
              alt="SECORA Logo" 
              className="h-8 w-8 rounded-md object-cover shadow-sm border border-white/20"
            />
            <div className="flex flex-col">
              <span className="font-heading font-black tracking-[0.2em] text-sm text-white group-hover:text-emerald-400 transition-colors">
                SECORA
              </span>
              <span className="font-mono text-[8px] text-white/50 tracking-wider">
                RECON WORKSTATION
              </span>
            </div>
          </Link>
          <button 
            className="lg:hidden p-1.5 rounded-md hover:bg-white/10 text-white/70"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* System Node Telemetry */}
        <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between font-mono text-[9px] text-white/60 bg-black/20">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-400 font-bold">NODE // ONLINE</span>
          </span>
          <span>LAT: 12ms</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-grow py-6 flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `group flex items-center px-3.5 py-2.5 transition-all font-heading text-xs tracking-wider rounded-sm ${
                    isActive 
                      ? 'bg-emerald-500/15 text-emerald-400 font-bold border-l-2 border-emerald-400 shadow-xs' 
                      : 'text-white/70 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                  }`
                }
              >
                <span className="font-mono text-[10px] mr-3 opacity-40 group-hover:opacity-100 transition-opacity">
                  [ {item.index} ]
                </span>
                <span className="uppercase tracking-[0.1em]">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Profile Card & Logout */}
        {user && (
          <div className="p-4 border border-white/10 bg-[#0a1815] flex flex-col gap-3 rounded-md m-3 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3 min-w-0">
                {user.profile_image ? (
                  <img 
                    src={user.profile_image} 
                    alt={user.username} 
                    className="h-8 w-8 rounded-full object-cover border border-emerald-400 shrink-0" 
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-emerald-700/60 border border-emerald-500/40 flex items-center justify-center text-emerald-200 font-bold text-xs shrink-0">
                    {user.username.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="font-heading font-bold text-xs text-white truncate">
                    {user.full_name || user.username.toUpperCase()}
                  </span>
                  <span className="text-[9px] text-emerald-400 font-mono tracking-wider uppercase">
                    ● AUTHENTICATED
                  </span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-red-400 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center justify-between font-mono text-[9px] text-white/50 pt-2 border-t border-white/10 relative z-10">
              <span>{user.role ? user.role.toUpperCase() : 'ANALYST'}</span>
              <span className="text-emerald-400">ENCRYPTED</span>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow lg:pl-72 flex flex-col min-h-screen">
        {/* Header Component */}
        <header className="h-16 border-b border-white/10 bg-[#06100e]/85 backdrop-blur-md flex items-center justify-between px-8 fixed top-0 left-0 lg:left-72 right-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-1.5 rounded-md hover:bg-white/10 border border-white/10"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5 text-white" />
            </button>
            <h1 className="font-heading font-bold tracking-[0.2em] text-xs text-white/80">{getHeaderTitle()}</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <Link 
              to="/reconnaissance"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm text-xs font-mono text-white/80 hover:text-emerald-300 transition-colors"
            >
              <Search className="h-3 w-3 text-emerald-400" />
              <span>NEW SCAN</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-heading text-[9px] text-white/70 tracking-widest uppercase">SYS.STATUS / ONLINE</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-white/10"></div>
            <div className="font-mono text-[9px] text-white/50 tracking-widest">SECORA.OS / V1.0</div>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-grow pt-16 blueprint-bg flex flex-col relative bg-[#06100e]">
          {children}
        </main>
      </div>
    </div>
  );
}
