import Link from 'next/link';
import { Shield, Activity, FileText, Server, Network, DollarSign, AlertTriangle } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: Shield },
  { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
  { name: 'SOP Sentinel', href: '/sop', icon: FileText },
  { name: 'AI Models', href: '/models', icon: Activity },
  { name: 'Runtime', href: '/runtime', icon: Server },
  { name: 'Network', href: '/network', icon: Network },
  { name: 'Cost Center', href: '/cost', icon: DollarSign },
];

export function Sidebar() {
  return (
    <div className="flex flex-col w-64 bg-[var(--color-panel)] border-r border-[var(--color-panel-border)] h-screen text-[var(--color-foreground)]">
      <div className="flex items-center justify-center h-16 border-b border-[var(--color-panel-border)] px-4">
        <Shield className="w-8 h-8 text-[var(--color-accent)] mr-2" />
        <span className="text-xl font-bold tracking-wider">AEGISFLOW</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-[var(--color-panel-border)] transition-colors group"
            >
              <item.icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-[var(--color-accent)] transition-colors" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-[var(--color-panel-border)]">
        <div className="flex items-center text-xs text-gray-400">
          <div className="w-2 h-2 rounded-full bg-[var(--color-status-green)] mr-2"></div>
          System Healthy
        </div>
      </div>
    </div>
  );
}
