import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import NewsCard from '../features/news/components/NewsCard';
import NewsCardSkeleton from '../features/news/components/NewsCardSkeleton';
import { useCategories, useInfiniteNews, useSources } from '../features/news/hooks';
import CustomSelect from '../components/ui/CustomSelect';
import Hero from '../components/Hero';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const newsSectionRef = useRef(null);

  const activeCategorySlug = searchParams.get('category');
  const activeSource = searchParams.get('source');
  const activeSort = searchParams.get('sort') || 'newest';

  const { data: categories = [] } = useCategories();
  const { data: sources = [] } = useSources();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteNews(activeCategorySlug, activeSource, activeSort);

  const news = data?.pages.flatMap(page => Array.isArray(page) ? page : (page?.news || [])) || [];

  const sortOptions = [
    { value: 'newest', label: 'Спочатку найновіші' },
    { value: 'oldest', label: 'Спочатку найстаріші' }
  ];

  const sourceOptions = [
    { value: '', label: 'Всі джерела' },
    ...sources.map(src => ({ value: src, label: src }))
  ];

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') newParams.delete('page');
    setSearchParams(newParams);
  };

  const handleCategoryClick = (categorySlug) => {
    if (activeCategorySlug === categorySlug) return;
    updateFilter('category', categorySlug);
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      
      <Hero scrollToNewsRef={newsSectionRef} />

      <div 
        ref={newsSectionRef} 
        className="max-w-5xl mx-auto px-4 sm:px-6 py-16 scroll-mt-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
          <h1 className="text-3xl font-black tracking-tight text-fg">ОСТАННІ НОВИНИ</h1>

          <div className="flex items-center gap-3">
            <CustomSelect
              value={activeSort}
              options={sortOptions}
              onChange={(value) => updateFilter('sort', value)}
            />

            <CustomSelect
              value={activeSource || ''}
              options={sourceOptions}
              onChange={(value) => updateFilter('source', value || null)}
              placeholder="Всі джерела"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          <button
            onClick={() => handleCategoryClick(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${!activeCategorySlug
              ? 'bg-fg text-bg border-fg'
              : 'bg-transparent text-muted border-border hover:border-fg hover:text-fg'
              }`}
          >
            Всі новини
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id || cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${activeCategorySlug === cat.slug
                ? 'bg-fg text-bg border-fg'
                : 'bg-transparent text-muted border-border hover:border-fg hover:text-fg'
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {isError && !isLoading && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-500">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Помилка з'єднання</h3>
              <p className="text-sm opacity-90">
                {error?.response?.data?.message || 'Не вдалося завантажити новини. Перевірте, чи запущено сервер.'}
              </p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {news.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((article) => (
                  <NewsCard key={article.id || article._id} article={article} />
                ))}
              </div>
            ) : (
              !isError && (
                <div className="text-center py-20 border border-dashed border-border rounded-xl">
                  <p className="text-muted mb-2">Не знайдено новин за вибраними фільтрами.</p>
                  <button
                    onClick={() => setSearchParams({})}
                    className="text-sm text-industrial-accent hover:underline mt-2"
                  >
                    Скинути всі фільтри
                  </button>
                </div>
              )
            )}

            {news.length > 0 && hasNextPage && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-6 py-2.5 bg-fg/5 hover:bg-fg/10 border border-border rounded-xl text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Завантаження...</span>
                    </>
                  ) : (
                    'Завантажити ще'
                  )}
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}