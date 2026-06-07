import { useState } from 'react';
import { Loader2, Trash2, ExternalLink, CheckCircle, Clock, AlertTriangle, Edit, X, Save } from 'lucide-react';

import { useAdminNews, useUpdateAdminNews, useDeleteAdminNews } from '../hooks';
import { useCategories } from '../../news/hooks';
import Pagination from '../../../components/ui/Pagination';
import CustomSelect from '../../../components/ui/CustomSelect';

export default function AdminNewsTab() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const [editForm, setEditForm] = useState(null);
  const [newsToDelete, setNewsToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const { data: newsData, isLoading } = useAdminNews(page, limit);
  const { data: categories = [] } = useCategories();

  const { mutate: updateNews, isPending: isSaving } = useUpdateAdminNews();
  const { mutate: deleteNews, isPending: isDeleting } = useDeleteAdminNews();

  const news = newsData?.data?.news || newsData?.data || [];
  const totalPages = newsData?.meta?.totalPages || 1;

  const categoryOptions = [
    { value: '', label: 'Без категорії' },
    ...categories.map(cat => ({ value: cat._id || cat.id, label: cat.name }))
  ];

  const aiStatusOptions = [
    { value: 'pending', label: 'В очікуванні' },
    { value: 'completed', label: 'Завершено' },
    { value: 'failed', label: 'Помилка' }
  ];

  const executeDelete = () => {
    if (!newsToDelete) return;
    deleteNews(newsToDelete, {
      onSuccess: () => {
        setNewsToDelete(null);
        showToast('Новину назавжди видалено');
      },
      onError: () => showToast('Не вдалося видалити новину', 'error')
    });
  };

  const handleOpenEdit = (item) => {
    setEditForm({ ...item, tagsString: item.tags?.join(', ') || '' });
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    const id = editForm.id || editForm._id;
    const parsedTags = editForm.tagsString.split(',').map(t => t.trim()).filter(t => t.length > 0);

    const updateData = {
      title: editForm.title,
      category: editForm.category?._id || editForm.category || null,
      aiStatus: editForm.aiStatus,
      tags: parsedTags
    };

    updateNews({ id, data: updateData }, {
      onSuccess: () => {
        setEditForm(null);
        showToast('Зміни успішно збережено');
      },
      onError: () => showToast('Не вдалося оновити новину', 'error')
    });
  };

  const renderAIStatus = (status) => {
    switch (status) {
      case 'completed': return <span className="flex w-fit items-center gap-1 text-green-500 bg-green-500/10 px-2 py-1 rounded text-xs font-medium"><CheckCircle size={12} /> Завершено</span>;
      case 'failed': return <span className="flex w-fit items-center gap-1 text-red-500 bg-red-500/10 px-2 py-1 rounded text-xs font-medium"><AlertTriangle size={12} /> Помилка</span>;
      case 'pending':
      default: return <span className="flex w-fit items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded text-xs font-medium"><Clock size={12} /> В очікуванні</span>;
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 relative pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Управління новинами</h1>
      </div>

      <div className="bg-bg border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-fg/[0.02] border-b border-border text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Заголовок та джерело</th>
                <th className="px-4 py-3 font-medium">Категорія та теги</th>
                <th className="px-4 py-3 font-medium">Статус ШІ</th>
                <th className="px-4 py-3 font-medium text-right">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan="4" className="px-4 py-10 text-center"><Loader2 size={24} className="animate-spin text-muted mx-auto" /></td></tr>
              ) : news.length === 0 ? (
                <tr><td colSpan="4" className="px-4 py-10 text-center text-muted">Новин не знайдено.</td></tr>
              ) : (
                news.map((item) => (
                  <tr key={item._id || item.id} className="hover:bg-fg/5 transition-colors">
                    <td className="px-4 py-3 max-w-[300px] truncate">
                      <div className="font-medium text-fg truncate">{item.title}</div>
                      <div className="text-xs text-muted mt-0.5">{item.source}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="bg-fg/5 border border-border px-2 py-0.5 rounded text-xs text-muted">
                          {item.category?.name || 'Без категорії'}
                        </span>
                        {item.tags?.length > 0 && (
                          <span className="text-[10px] text-muted max-w-[150px] truncate">{item.tags.join(', ')}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">{renderAIStatus(item.aiStatus)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a href={item.sourceLink} target="_blank" rel="noreferrer" className="p-1.5 text-muted hover:text-industrial-accent rounded transition-colors"><ExternalLink size={16} /></a>
                        <button onClick={() => handleOpenEdit(item)} className="p-1.5 text-muted hover:text-blue-500 rounded transition-colors"><Edit size={16} /></button>
                        <button onClick={() => setNewsToDelete(item._id || item.id)} className="p-1.5 text-muted hover:text-red-500 rounded transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange => setPage(onPageChange)}
            disabled={isLoading}
          />
        )}
      </div>

      {editForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-bg border border-border rounded-2xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border bg-fg/[0.02] rounded-t-2xl">
              <h2 className="font-bold text-lg">Редагувати новину</h2>
              <button onClick={() => setEditForm(null)} className="p-1 text-muted hover:text-fg rounded"><X size={20} /></button>
            </div>
            <form onSubmit={handleEditSave} className="p-5 space-y-5">
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Заголовок</label>
                <textarea value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full bg-fg/5 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-industrial-accent min-h-[60px] resize-y" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Категорія</label>
                  <CustomSelect
                    value={editForm.category?._id || editForm.category || ''}
                    options={categoryOptions}
                    onChange={(value) => setEditForm({ ...editForm, category: value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Статус ШІ</label>
                  <CustomSelect
                    value={editForm.aiStatus || 'pending'}
                    options={aiStatusOptions}
                    onChange={(value) => setEditForm({ ...editForm, aiStatus: value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Теги (через кому)</label>
                <input type="text" value={editForm.tagsString} onChange={(e) => setEditForm({ ...editForm, tagsString: e.target.value })} placeholder="напр. ШІ, Google, Технології" className="w-full bg-fg/5 border border-border rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-industrial-accent" />
              </div>
              <div className="pt-4 flex justify-end gap-2 border-t border-border mt-6">
                <button type="button" onClick={() => setEditForm(null)} className="px-4 py-2 text-sm font-medium text-muted hover:text-fg transition-colors">Скасувати</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-medium bg-fg text-bg rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Зберегти зміни
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {newsToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-bg/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-bg border border-border rounded-2xl shadow-2xl w-full max-w-[320px] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-500"><AlertTriangle size={24} /></div>
              <h3 className="text-lg font-bold mb-2">Видалити новину?</h3>
              <p className="text-sm text-muted">Цю дію не можна скасувати. Статтю буде назавжди видалено з бази даних.</p>
            </div>
            <div className="flex border-t border-border bg-fg/[0.02]">
              <button onClick={() => setNewsToDelete(null)} disabled={isDeleting} className="flex-1 py-3 text-sm font-medium text-fg hover:bg-fg/5 border-r border-border disabled:opacity-50">Скасувати</button>
              <button onClick={executeDelete} disabled={isDeleting} className="flex-1 py-3 text-sm font-medium text-red-500 hover:bg-red-500/10 flex items-center justify-center gap-2 disabled:opacity-50">
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : 'Видалити'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[200] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-bg border-border text-fg'}`}>
            {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} className="text-green-500" />}
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}