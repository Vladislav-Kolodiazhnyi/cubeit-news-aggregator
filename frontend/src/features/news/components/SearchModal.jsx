import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, ExternalLink, Calendar, ArrowRight } from 'lucide-react';
import api from '../../../api/axios';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
      setSelectedIndex(-1);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await api.get(`/news?search=${query}&limit=5`);
        const fetchedNews = Array.isArray(response.data.data)
          ? response.data.data
          : response.data.data?.news || [];
        setResults(fetchedNews);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e) => {
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        window.open(results[selectedIndex].sourceLink, '_blank', 'noopener,noreferrer');
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-32 px-4">

      <div
        className="absolute inset-0 bg-bg/50 backdrop-blur-sm transition-opacity cursor-pointer"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-bg border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        <div className="flex items-center px-4 py-3 border-b border-border bg-fg/[0.02]">
          <Search size={20} className="text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Пошук новин за заголовком..."
            className="flex-1 bg-transparent border-none px-4 py-2 text-fg focus:outline-none placeholder:text-muted cursor-text"
          />
          {isLoading && <Loader2 size={18} className="animate-spin text-muted shrink-0" />}

          <button
            onClick={onClose}
            className="cursor-pointer ml-2 p-1.5 text-muted hover:text-fg hover:bg-fg/10 rounded-lg transition-colors text-xs font-mono flex items-center gap-1"
          >
            ESC
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!query.trim() && (
            <div className="px-4 py-10 text-center text-sm text-muted">
              Введіть запит, щоб шукать серед усіх новин.
            </div>
          )}

          {query.trim() && !isLoading && results.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-muted">
              Нічого не знайдено за запитом "{query}".
            </div>
          )}

          {results.map((article, index) => {
            const isSelected = index === selectedIndex;

            return (
              <a
                key={article.id || article._id}
                href={article.sourceLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className={`cursor-pointer block p-3 rounded-xl transition-all group ${isSelected
                    ? 'bg-fg/10 ring-1 ring-industrial-accent'
                    : 'hover:bg-fg/5'
                  }`}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className={`text-sm font-semibold transition-colors line-clamp-1 ${isSelected ? 'text-industrial-accent' : 'text-fg group-hover:text-industrial-accent'
                      }`}>
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                      {article.category?.name && (
                        <span className="font-medium bg-fg/5 px-2 py-0.5 rounded text-fg">
                          {article.category.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <ArrowRight
                    size={16}
                    className={`shrink-0 mt-1 transition-all duration-200 ${isSelected
                        ? 'text-industrial-accent opacity-100 translate-x-0'
                        : 'text-muted opacity-0 -translate-x-2'
                      }`}
                  />
                </div>
              </a>
            );
          })}
        </div>

        <div className="px-4 py-2 bg-fg/[0.02] border-t border-border flex items-center justify-between text-xs text-muted select-none">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-fg/10 border border-border rounded font-mono text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-fg/10 border border-border rounded font-mono text-[10px]">↓</kbd>
              <span className="ml-1">Навігація</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-fg/10 border border-border rounded font-mono text-[10px]">↵</kbd>
              <span className="ml-1">Відкрити</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}