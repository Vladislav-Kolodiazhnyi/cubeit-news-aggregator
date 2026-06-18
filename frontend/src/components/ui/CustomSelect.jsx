import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CustomSelect({ value, onChange, options, placeholder = 'Select option' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const currentOption = options.find(opt => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block w-full min-w-[160px]" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-fg/5 border border-border rounded-xl text-sm font-medium text-fg hover:border-fg/20 focus:outline-none focus:border-industrial-accent transition-all text-left cursor-pointer"
      >
        <span className="truncate">{currentOption ? currentOption.label : placeholder}</span>
        <ChevronDown
          size={16}
          className={`text-muted transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-full min-w-[160px] bg-bg border border-border rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 p-1.5">
          <div className="max-h-60 overflow-y-auto flex flex-col gap-1 scrollbar-hide">
            {options.map((opt) => {
              const isSelected = opt.value === value;

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm font-medium transition-all rounded-xl flex items-center justify-between ${
                    isSelected
                      ? 'bg-fg text-bg font-bold shadow-sm cursor-default'
                      : 'text-fg hover:bg-fg/5 cursor-pointer'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}