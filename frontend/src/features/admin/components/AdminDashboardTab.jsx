import { useState } from 'react';
import { Loader2, AlertCircle, Newspaper, BrainCircuit, AlertTriangle, Users, RefreshCw, CheckCircle } from 'lucide-react';
import { useAdminStats, useTriggerParsing } from '../hooks';

export default function AdminDashboardTab({ isAdmin }) {
  const [toast, setToast] = useState(null);

  const { data: stats, isLoading, isError } = useAdminStats(isAdmin);
  const { mutate: startParsing, isPending: isParsing } = useTriggerParsing();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleStartParsing = () => {
    if (isParsing) return;
    startParsing(null, {
      onSuccess: (res) => showToast(res?.message || 'Процес парсингу успішно завершено!'),
      onError: (err) => showToast(err.response?.data?.message || 'Не вдалося запустити процес парсингу.', 'error')
    });
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-muted" /></div>;
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 flex items-center gap-2">
        <AlertCircle size={20} /> Не вдалося завантажити статистику головної панелі.
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 relative h-full flex flex-col">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Головна панель</h1>
        </div>

        <button
          onClick={handleStartParsing}
          disabled={isParsing}
          className="cursor-pointer disabled:cursor-not-allowed px-4 py-2 bg-fg text-bg rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-sm"
        >
          <RefreshCw size={16} className={isParsing ? 'animate-spin' : ''} />
          {isParsing ? 'Парсинг...' : 'Запустити скрапер'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">

        <div className="p-6 min-h-[145px] bg-fg/[0.02] border border-border rounded-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="text-muted">
            <span className="text-xs font-mono uppercase tracking-wider opacity-60">Всього новин</span>
          </div>
          <span className="text-4xl font-extrabold text-fg tracking-tight">{stats?.news?.total || 0}</span>
          <div className="absolute -bottom-5 -right-5 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-300 text-fg">
            <Newspaper size={96} />
          </div>
        </div>

        <div className="p-6 min-h-[145px] bg-blue-500/[0.03] border border-blue-500/10 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="text-blue-500/70">
            <span className="text-xs font-mono uppercase tracking-wider opacity-80">Очікують ШІ</span>
          </div>
          <span className="text-4xl font-extrabold text-blue-500 tracking-tight">{stats?.news?.pending || 0}</span>
          <div className="absolute -bottom-5 -right-5 opacity-[0.04] group-hover:opacity-[0.09] transition-opacity duration-300 text-blue-500">
            <BrainCircuit size={96} />
          </div>
        </div>

        <div className="p-6 min-h-[145px] bg-red-500/[0.03] border border-red-500/10 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="text-red-500/70">
            <span className="text-xs font-mono uppercase tracking-wider opacity-80">Помилки ШІ</span>
          </div>
          <span className="text-4xl font-extrabold text-red-500 tracking-tight">{stats?.news?.failed || 0}</span>
          <div className="absolute -bottom-5 -right-5 opacity-[0.04] group-hover:opacity-[0.09] transition-opacity duration-300 text-red-500">
            <AlertTriangle size={96} />
          </div>
        </div>

        <div className="p-6 min-h-[145px] bg-fg/[0.02] border border-border rounded-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="text-muted">
            <span className="text-xs font-mono uppercase tracking-wider opacity-60">Всього користувачів</span>
          </div>
          <span className="text-4xl font-extrabold text-fg tracking-tight">{stats?.users?.total || 0}</span>
          <div className="absolute -bottom-5 -right-5 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-300 text-fg">
            <Users size={96} />
          </div>
        </div>

      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-[200] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-bg border-border text-fg'
            }`}>
            {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} className="text-green-500" />}
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        </div>
      )}

    </div>
  );
}