import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Search } from 'lucide-react';
import useThemeStore from '../../store/useThemeStore';
import useAuthStore from '../../store/useAuthStore';
import UserDropdown from '../../features/auth/components/UserDropdown';
import ScrollProgress from '../../components/ui/ScrollProgress';
import SearchModal from '../../features/news/components/SearchModal';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div className="sticky top-4 z-50 px-4 w-full flex justify-center">
        <nav className="relative w-full max-w-4xl border border-border bg-bg/80 backdrop-blur-md rounded-2xl shadow-sm flex items-center justify-between px-4 h-14">

          <div className="absolute -inset-px pointer-events-none overflow-hidden rounded-2xl">
            <ScrollProgress />
          </div>

          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img
                src={theme === 'dark' ? '/logo-dark.png' : '/logo-light.png'}
                alt="CubeIT Logo"
                className="h-6 w-auto object-contain"
              />
              <span className="text-lg font-extrabold tracking-wide hidden sm:block">
                Cube<span className="text-blue-500">I</span><span className="text-yellow-400">T</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-muted bg-fg/5 hover:bg-fg/10 border border-border rounded-lg transition-colors"
            >
              <Search size={16} />
              <span>Пошук...</span>
              <kbd className="ml-4 px-1.5 py-0.5 bg-bg border border-border rounded font-mono text-[10px]">
                Ctrl K
              </kbd>
            </button>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 text-muted hover:text-fg rounded-md transition-colors"
            >
              <Search size={18} />
            </button>

            <button onClick={toggleTheme} className="p-2 text-muted hover:text-fg transition-colors rounded-md">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {isAuthenticated ? (
              <div className="pl-3 border-l border-border">
                <UserDropdown />
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-3 border-l border-border">
                <Link to="/login" className="text-sm font-medium text-muted hover:text-fg">Вхід</Link>
                <Link to="/register" className="text-sm font-medium bg-fg text-bg px-4 py-1.5 rounded-xl hover:opacity-90 transition-opacity">Реєстрація</Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}