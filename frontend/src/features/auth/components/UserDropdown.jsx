import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Settings, LogOut, Shield } from 'lucide-react';
import useAuthStore from '../../../store/useAuthStore';

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const initial = user.username ? user.username.charAt(0).toUpperCase() : '?';

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer w-8 h-8 rounded-full bg-border flex items-center justify-center text-sm font-medium hover:ring-2 hover:ring-industrial-accent transition-all overflow-hidden border border-border"
      >
        {user.avatar ? (
          <img
            src={`${BASE_URL}${user.avatar}`}
            alt="Профіль"
            className="w-full h-full object-cover"
          />
        ) : (
          initial
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-bg/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">

          <div className="px-4 py-3 border-b border-border bg-fg/2">
            <p className="text-sm font-semibold text-fg truncate">{user.username}</p>
            <p className="text-xs text-muted truncate">{user.email}</p>
          </div>

          <div className="p-1.5 flex flex-col gap-0.5">
            <Link
              to="/profile?tab=bookmarks"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-fg hover:bg-fg/5 rounded-lg transition-colors"
            >
              <Bookmark size={16} />
              Закладки
            </Link>

            <Link
              to="/profile?tab=settings"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-fg hover:bg-fg/5 rounded-lg transition-colors"
            >
              <Settings size={16} />
              Налаштування
            </Link>

            {user.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-fg hover:bg-fg/5 rounded-lg transition-colors"
              >
                <Shield size={16} />
                Панель адміністратора
              </Link>
            )}
          </div>

          <div className="p-1.5 border-t border-border bg-fg/1">
            <button
              onClick={handleLogout}
              className="cursor-pointer w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
            >
              <LogOut size={16} />
              Вийти
            </button>
          </div>
        </div>
      )}
    </div>
  );
}