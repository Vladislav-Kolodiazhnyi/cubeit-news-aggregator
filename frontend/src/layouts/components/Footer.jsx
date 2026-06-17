import { Link, useLocation } from 'react-router-dom';
import { Github, ArrowUp, Send, Mail } from 'lucide-react';
import useThemeStore from '../../store/useThemeStore';

export default function Footer() {
  const { theme } = useThemeStore();
  const location = useLocation();

  const logoSrc = theme === 'dark' ? '/logo-light.png' : '/logo-dark.png';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab');

  const isAdminPage = location.pathname.startsWith('/admin');
  const isProfileSettingsPage = location.pathname === '/profile' && currentTab === 'settings';

  if (isAdminPage || isProfileSettingsPage) {
    return null;
  }

  return (
    <footer className="w-full bg-bg/50 backdrop-blur-sm mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-10">

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <Link to="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
            <img src={logoSrc} alt="CubeIT" className="h-10 w-auto object-contain" />
            <span className="text-2xl font-black tracking-tighter text-fg">
              CubeIT
            </span>
          </Link>

          <div className="flex items-center gap-5">
            <a href="https://t.me/VladKolodiazhnyi" target="_blank" rel="noreferrer" className="text-muted hover:text-fg transition-colors" title="Telegram">
              <Send size={18} />
            </a>
            <a href="https://github.com/Vladislav-Kolodiazhnyi" target="_blank" rel="noreferrer" className="text-muted hover:text-fg transition-colors" title="GitHub">
              <Github size={19} />
            </a>
            <a href="mailto:vlad2005kolodiazhnyi@gmail.com" className="text-muted hover:text-fg transition-colors" title="Gmail">
              <Mail size={19} />
            </a>
          </div>
        </div>

        <hr className="border-border mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-muted text-center md:text-left">
            © {new Date().getFullYear()} IT News Aggregator. <br className="md:hidden" />
            Усі права захищено.
          </div>

          <div className="flex items-center gap-4">

            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/5 border border-green-500/20 rounded-full select-none">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
                System Operational
              </span>
            </div>

            <button
              onClick={scrollToTop}
              className="p-2.5 text-muted hover:text-fg bg-fg/5 hover:bg-fg/10 border border-border rounded-xl transition-all active:scale-95 group"
              aria-label="Вгору"
              title="Вгору"
            >
              <ArrowUp size={16} className="transition-transform group-hover:-translate-y-0.5" />
            </button>

          </div>
        </div>
      </div>
    </footer>
  );
}