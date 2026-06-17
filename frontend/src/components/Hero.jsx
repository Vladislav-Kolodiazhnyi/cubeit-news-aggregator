import { ArrowDown, Sparkles } from 'lucide-react';

export default function Hero({ scrollToNewsRef }) {
  
  const handleScroll = () => {
    if (scrollToNewsRef?.current) {
      scrollToNewsRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-bg transition-colors duration-300">

      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:25px_25px] md:bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto flex flex-col items-center text-center z-10 space-y-6 md:space-y-8">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-fg/5 border border-border rounded-full text-fg text-xs md:text-sm font-medium tracking-wide shadow-sm backdrop-blur-md">
          <span>Агрегатор нового покоління</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-fg max-w-3xl px-2">
          Інформаційна система агрегації та <br className="hidden sm:inline" />
          класифікації новин IT-індустрії
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-muted font-normal max-w-2xl leading-relaxed px-2">
          Розумна стрічка новин, яка економить ваш час. Вам більше не потрібно перевіряти 
          десятки сайтів вручну, адже система автоматично знаходить, аналізує та групує 
          головні події індустрії в одну зручну й чисту стрічку.
        </p>

        <div className="pt-2">
          <button
            onClick={handleScroll}
            className="cursor-pointer group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-fg text-bg font-semibold rounded-xl overflow-hidden hover:opacity-95 active:scale-[0.98] transition-all shadow-md"
          >
            <span>Читати стрічку</span>
            <ArrowDown size={18} className="transition-transform duration-300 group-hover:translate-y-0.5" />
          </button>
        </div>

      </div>
    </div>
  );
}