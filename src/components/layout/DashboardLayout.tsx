import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CyberMapBackground } from '@/components/dashboard/CyberMapBackground';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[var(--color-background)] overflow-hidden relative">
      {/* Background Cyber Map Watermark */}
      <CyberMapBackground />

      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
