import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutDashboard, Newspaper, FolderTree, Users } from 'lucide-react';

import useAuthStore from '../store/useAuthStore';
import AdminDashboardTab from '../features/admin/components/AdminDashboardTab';
import AdminNewsTab from '../features/admin/components/AdminNewsTab';
import AdminCategoriesTab from '../features/admin/components/AdminCategoriesTab';
import AdminUsersTab from '../features/admin/components/AdminUsersTab';

export default function Admin() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuthStore();

  const activeTab = searchParams.get('tab') || 'dashboard';
  const isAdmin = isAuthenticated && user?.role === 'admin';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  if (!isAdmin) return null;

  return (
    <div className="pt-28 pb-16 px-4 md:px-0 animate-in fade-in duration-500 max-w-6xl mx-auto flex flex-col md:flex-row gap-8 w-full">

      <aside className="w-full md:w-64 shrink-0">
        <div className="sticky top-24 bg-bg/50 backdrop-blur-md border border-border rounded-2xl p-4 flex flex-col gap-2">
          <h2 className="text-xs font-mono text-muted mb-2 px-3 uppercase tracking-wider">
            Панель адміністратора
          </h2>

          <button
            onClick={() => handleTabChange('dashboard')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-fg text-bg shadow-md cursor-default' : 'text-muted hover:text-fg hover:bg-fg/5 cursor-pointer'
              }`}
          >
            <LayoutDashboard size={18} /> Огляд
          </button>

          <button
            onClick={() => handleTabChange('news')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'news' ? 'bg-fg text-bg shadow-md cursor-default' : 'text-muted hover:text-fg hover:bg-fg/5 cursor-pointer'
              }`}
          >
            <Newspaper size={18} /> Новини
          </button>

          <button
            onClick={() => handleTabChange('categories')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'categories' ? 'bg-fg text-bg shadow-md cursor-default' : 'text-muted hover:text-fg hover:bg-fg/5 cursor-pointer'
              }`}
          >
            <FolderTree size={18} /> Категорії
          </button>

          <button
            onClick={() => handleTabChange('users')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-fg text-bg shadow-md cursor-default' : 'text-muted hover:text-fg hover:bg-fg/5 cursor-pointer'
              }`}
          >
            <Users size={18} /> Користувачі
          </button>
        </div>
      </aside>

      <main className="flex-1 min-h-[500px]">
        {activeTab === 'dashboard' && <AdminDashboardTab isAdmin={isAdmin} />}
        {activeTab === 'news' && <AdminNewsTab />}
        {activeTab === 'categories' && <AdminCategoriesTab />}
        {activeTab === 'users' && <AdminUsersTab />}
      </main>

    </div>
  );
}