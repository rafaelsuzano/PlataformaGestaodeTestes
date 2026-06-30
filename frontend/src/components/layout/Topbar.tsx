import { Search, Bell, Settings, HelpCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Topbar() {
  const navigate = useNavigate();

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-background border-b border-slate-800/50 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        {/* Workspace Selector Placeholder */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800/30 rounded-md border border-slate-700/50 cursor-pointer hover:bg-slate-800/50 transition-colors">
          <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
            S
          </div>
          <span className="text-sm font-medium text-slate-200">Suzano Core QA</span>
        </div>

        {/* Global Search */}
        <div className="relative max-w-md w-full ml-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search projects, tests, executions... (Cmd+K)" 
            className="w-full bg-slate-800/40 border border-slate-700/50 rounded-md pl-10 pr-4 py-1.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">
          <Plus size={16} />
          <span>New</span>
        </button>
        
        <div className="w-px h-6 bg-slate-800 mx-1 hidden md:block"></div>

        <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-md transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"></span>
        </button>

        <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-md transition-colors">
          <HelpCircle size={18} />
        </button>

        <button 
          onClick={() => navigate('/admin')}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-md transition-colors"
        >
          <Settings size={18} />
        </button>

        {/* User Profile */}
        <div className="ml-2 w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 cursor-pointer border border-slate-700"></div>
      </div>
    </header>
  );
}
