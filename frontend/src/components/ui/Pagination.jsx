import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange, disabled }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const siblingCount = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - siblingCount && i <= page + siblingCount)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <div className="w-full px-4 py-3 border-t border-border flex items-center justify-center bg-fg/[0.02]">
      <div className="flex items-center gap-1">

        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1 || disabled}
          className="cursor-pointer disabled:cursor-not-allowed p-1.5 border border-border rounded-lg bg-bg hover:bg-fg/5 disabled:opacity-40 disabled:hover:bg-bg transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {getPageNumbers().map((p, idx) => {
          const isCurrentPage = p === page;
          const isDots = p === '...';
          
          return (
            <button
              key={idx}
              disabled={isDots || disabled}
              onClick={() => typeof p === 'number' && onPageChange(p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all min-w-[32px] ${
                isCurrentPage
                  ? 'bg-fg text-bg border-fg shadow-sm font-semibold cursor-default'
                  : isDots
                    ? 'border-transparent text-muted bg-transparent cursor-default'
                    : 'bg-bg border-border text-muted hover:text-fg hover:border-fg/40 cursor-pointer disabled:cursor-not-allowed'
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages || disabled}
          className="cursor-pointer disabled:cursor-not-allowed p-1.5 border border-border rounded-lg bg-bg hover:bg-fg/5 disabled:opacity-40 disabled:hover:bg-bg transition-colors"
        >
          <ChevronRight size={16} />
        </button>

      </div>
    </div>
  );
}