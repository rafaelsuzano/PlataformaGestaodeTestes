import { Outlet } from 'react-router-dom';
import { Sidebar } from './layout/Sidebar';
import { Topbar } from './layout/Topbar';
import { Breadcrumbs } from './layout/Breadcrumbs';

export default function Layout() {
  // O Layout agora utiliza puramente TailwindCSS, estruturado num modelo moderno de 3 áreas.
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 bg-background custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Breadcrumbs />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
