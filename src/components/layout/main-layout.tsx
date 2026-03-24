import { Sidebar }   from "./sidebar";
import { MobileNav } from "./mobile-nav";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-zinc-900">

      {/* Top: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar — desktop only */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

      </div>

      {/* Mobile bottom nav */}
      <MobileNav />

    </div>
  );
}