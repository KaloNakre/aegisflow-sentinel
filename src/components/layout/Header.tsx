import { Bell, User, Search, Settings } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-[var(--color-panel)] border-b border-[var(--color-panel-border)]">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-[var(--color-foreground)]">Overview</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-1.5 bg-[#090c10] border border-[var(--color-panel-border)] rounded-md text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          />
        </div>
        
        <button className="p-2 text-gray-400 hover:text-[var(--color-foreground)] rounded-full hover:bg-[var(--color-panel-border)] transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-status-orange)] rounded-full border-2 border-[var(--color-panel)]"></span>
        </button>
        
        <button className="p-2 text-gray-400 hover:text-[var(--color-foreground)] rounded-full hover:bg-[var(--color-panel-border)] transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[var(--color-accent)] to-[#818cf8] flex items-center justify-center border-2 border-[var(--color-panel-border)]">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    </header>
  );
}
