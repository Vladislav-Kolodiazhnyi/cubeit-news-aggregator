import { Github, Twitter, Linkedin, Send } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-bg/30 backdrop-blur-md mt-auto shrink-0">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col items-center justify-center text-center gap-6">

        <div className="flex items-center gap-3 select-none group">
          <div className="w-10 h-10 rounded-2xl bg-fg flex items-center justify-center text-bg font-black text-2xl shadow-md transition-transform duration-300 group-hover:scale-105">
            C
          </div>
          <span className="text-2xl font-black tracking-tighter text-fg">
            Cube<span className="text-muted opacity-80">IT</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 text-muted hover:text-fg hover:bg-fg/5 rounded-xl transition-all duration-200"
            title="GitHub"
          >
            <Github size={20} />
          </a>
          <a
            href="https://telegram.org"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 text-muted hover:text-fg hover:bg-fg/5 rounded-xl transition-all duration-200"
            title="Telegram"
          >
            <Send size={20} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 text-muted hover:text-fg hover:bg-fg/5 rounded-xl transition-all duration-200"
            title="X (Twitter)"
          >
            <Twitter size={20} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 text-muted hover:text-fg hover:bg-fg/5 rounded-xl transition-all duration-200"
            title="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
        </div>

        <p className="text-xs font-mono text-muted tracking-wider opacity-60">
          &copy; {currentYear} CubeIT. All rights reserved.
        </p>

      </div>
    </footer>
  );
}