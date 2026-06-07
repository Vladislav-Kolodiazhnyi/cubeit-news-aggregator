import { useEffect } from 'react';
import { Bookmark, Settings, LogOut, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import NewsCard from '../features/news/components/NewsCard';
import NewsCardSkeleton from '../features/news/components/NewsCardSkeleton';
import ProfileSettings from '../features/auth/components/ProfileSettings';
import { useCurrentUser } from '../features/auth/hooks';

export default function Profile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { logout, isAuthenticated } = useAuthStore();

  const activeTab = searchParams.get('tab') || 'bookmarks';

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-muted" size={32} />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-red-500">
        Не вдалося завантажити дані профілю.
      </div>
    );
  }

  const initial = user.username ? user.username.charAt(0).toUpperCase() : '?';
  const savedArticles = user.savedNews || [];

  return (
    <div className="py-8 animate-in fade-in duration-500 max-w-4xl mx-auto w-full">

      <div className="flex items-center gap-6 mb-10 p-6 bg-fg/5 border border-border rounded-2xl">
        <div className="w-20 h-20 rounded-full bg-border flex items-center justify-center text-3xl font-bold text-fg shadow-inner overflow-hidden border border-border">
          {user.avatar ? (
            <img src={`${BASE_URL}${user.avatar}`} alt="Аватар" className="w-full h-full object-cover" />
          ) : (
            initial
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{user.username}</h1>
          <p className="text-muted">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Вийти</span>
        </button>
      </div>

      <div className="flex items-center gap-6 border-b border-border mb-8">
        <button
          onClick={() => handleTabChange('bookmarks')}
          className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === 'bookmarks' ? 'text-fg' : 'text-muted hover:text-fg'
            }`}
        >
          <Bookmark size={16} />
          Закладки
          {activeTab === 'bookmarks' && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-industrial-accent rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => handleTabChange('settings')}
          className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === 'settings' ? 'text-fg' : 'text-muted hover:text-fg'
            }`}
        >
          <Settings size={16} />
          Налаштування
          {activeTab === 'settings' && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-industrial-accent rounded-t-full" />
          )}
        </button>
      </div>

      <div className="min-h-[400px]">

        {activeTab === 'bookmarks' && (
          <div>
            {savedArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedArticles.map((article) => (
                  typeof article === 'object' ? (
                    <NewsCard key={article._id || article.id} article={article} />
                  ) : null
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-border rounded-xl">
                <Bookmark size={32} className="mx-auto text-muted mb-3 opacity-50" />
                <p className="text-fg font-medium mb-1">Ще немає збережених статей</p>
                <p className="text-sm text-muted">Новини, які ви додасте в закладки, з'являться тут.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <ProfileSettings user={user} />
        )}
      </div>
    </div>
  );
}