import { useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LayoutGrid, ArrowRightLeft, Users, Settings, LogOut, Bell, Search, PanelLeftClose, PanelRightClose, ShoppingCart } from "lucide-react";
import { useAuth } from '../context/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: string;
  title: string;
}

const CryoPayLogo = ({ isExpanded }: { isExpanded: boolean }) => (
  <div className="text-2xl font-bold tracking-tighter px-4 whitespace-nowrap">
    {isExpanded ? <>Cryo<span className="text-slate-500">Pay</span></> : <>C<span className="text-slate-500">P</span></>}
  </div>
);

interface SidebarProps {
  isExpanded: boolean;
  isPinned: boolean;
  onTogglePin: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const Sidebar = ({ isExpanded, isPinned, onTogglePin, onMouseEnter, onMouseLeave, currentPage, onNavigate, onLogout }: SidebarProps) => (
  <aside 
    className={`fixed top-0 left-0 h-full bg-slate-50 border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out z-50 ${isExpanded || isPinned ? 'w-64' : 'w-20'}`}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <div className="h-16 flex items-center border-b border-slate-200">
      <CryoPayLogo isExpanded={isExpanded || isPinned} />
    </div>
    <nav className="flex-1 px-2 py-4 space-y-2">
      <button onClick={() => onNavigate('dashboard')} className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${currentPage === 'dashboard' ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}>
        <LayoutGrid className="h-5 w-5 flex-shrink-0" />
        {(isExpanded || isPinned) && <span className="ml-3">Dashboard</span>}
      </button>
      <button onClick={() => onNavigate('buy-sell')} className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${currentPage === 'buy-sell' ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}>
        <ShoppingCart className="h-5 w-5 flex-shrink-0" />
        {(isExpanded || isPinned) && <span className="ml-3">Buy/Sell</span>}
      </button>
      <button onClick={() => onNavigate('transactions')} className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${currentPage === 'transactions' ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}>
        <ArrowRightLeft className="h-5 w-5 flex-shrink-0" />
        {(isExpanded || isPinned) && <span className="ml-3">Transactions</span>}
      </button>
      <button onClick={() => onNavigate('contacts')} className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${currentPage === 'contacts' ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}>
        <Users className="h-5 w-5 flex-shrink-0" />
        {(isExpanded || isPinned) && <span className="ml-3">Contacts</span>}
      </button>
      <button onClick={() => onNavigate('settings')} className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${currentPage === 'settings' ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}>
        <Settings className="h-5 w-5 flex-shrink-0" />
        {(isExpanded || isPinned) && <span className="ml-3">Settings</span>}
      </button>
    </nav>
    <div className="px-2 py-4 border-t border-slate-200">
      <Button variant="ghost" onClick={onTogglePin} className="w-full justify-start px-4 text-slate-600 mb-2">
        {isPinned ? <PanelLeftClose className="h-5 w-5 flex-shrink-0" /> : <PanelRightClose className="h-5 w-5 flex-shrink-0" />}
        {(isExpanded || isPinned) && <span className="ml-3">{isPinned ? 'Unpin' : 'Pin'}</span>}
      </Button>
      <Button variant="ghost" onClick={onLogout} className="w-full justify-start px-4 text-slate-600">
        <LogOut className="h-5 w-5 flex-shrink-0" />
        {(isExpanded || isPinned) && <span className="ml-3">Log Out</span>}
      </Button>
    </div>
  </aside>
);

const DashboardLayout = ({ children, currentPage, title }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const handleTogglePin = () => setIsSidebarPinned(!isSidebarPinned);
  const handleMouseEnter = () => !isSidebarPinned && setIsSidebarExpanded(true);
  const handleMouseLeave = () => !isSidebarPinned && setIsSidebarExpanded(false);
  
  const handleNavigate = (page: string) => {
    if (page === currentPage) return;
    navigate(`/${page}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex bg-white text-slate-800">
      <Sidebar 
        isExpanded={isSidebarExpanded} 
        isPinned={isSidebarPinned}
        onTogglePin={handleTogglePin}
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      <main className={`flex-1 min-h-screen transition-all duration-300 ease-in-out ${isSidebarExpanded || isSidebarPinned ? 'ml-64' : 'ml-20'}`}>
        <header className="h-16 flex items-center justify-between border-b border-slate-200 px-8">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input placeholder="Search..." className="pl-10 w-64" />
            </div>
            <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-sm">
                {user?.firstName?.[0] || 'U'}
              </div>
              <span className="text-sm font-medium">{user?.firstName || 'User'}</span>
            </div>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;