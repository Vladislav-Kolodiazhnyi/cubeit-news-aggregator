import { useState } from 'react';
import { Loader2, Trash2, Edit, Plus, X, Save, AlertCircle, CheckCircle, AlertTriangle, FolderTree, Eye, EyeOff } from 'lucide-react';

import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks';

export default function AdminCategoriesTab() {
  const [modalForm, setModalForm] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const { data: categories = [], isLoading } = useAdminCategories();
  const { mutate: createCat, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCat, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCat, isPending: isDeleting } = useDeleteCategory();

  const isSaving = isCreating || isUpdating;

  const openModal = (category = null) => {
    if (category) {
      setModalForm({ ...category, slug: category.slug || '' });
    } else {
      setModalForm({ name: '', slug: '', isActive: true });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!modalForm.name.trim() || !modalForm.slug.trim()) return;

    const formattedSlug = modalForm.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const payload = {
      name: modalForm.name,
      slug: formattedSlug,
      isActive: modalForm.isActive !== undefined ? modalForm.isActive : true
    };

    const isEditing = !!(modalForm._id || modalForm.id);

    if (isEditing) {
      const id = modalForm._id || modalForm.id;
      updateCat({ id, data: payload }, {
        onSuccess: () => { setModalForm(null); showToast('Категорію успішно оновлено'); },
        onError: () => showToast('Не вдалося зберегти категорію', 'error')
      });
    } else {
      createCat(payload, {
        onSuccess: () => { setModalForm(null); showToast('Категорію успішно створено'); },
        onError: () => showToast('Не вдалося створити категорію', 'error')
      });
    }
  };

  const executeDelete = () => {
    if (!categoryToDelete) return;
    deleteCat(categoryToDelete, {
      onSuccess: () => { setCategoryToDelete(null); showToast('Категорію видалено назавжди'); },
      onError: () => showToast('Не вдалося видалити категорію', 'error')
    });
  };

  const toggleActiveStatus = (category) => {
    const id = category._id || category.id;
    const currentStatus = category.isActive !== undefined ? category.isActive : true;

    updateCat({ id, data: { isActive: !currentStatus } }, {
      onSuccess: () => showToast(`Видимість категорії оновлено`),
      onError: () => showToast('Не вдалося оновити статус', 'error')
    });
  };

  return (
  <div className="animate-in fade-in slide-in-from-bottom-2 relative pb-20">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Управління категоріями</h1>
      </div>
      <button 
        onClick={() => openModal()} 
        className="cursor-pointer px-4 py-2 bg-fg text-bg rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
      >
        <Plus size={16} /> Нова категорія
      </button>
    </div>

    <div className="bg-bg border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-fg/[0.02] border-b border-border text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Назва категорії</th>
              <th className="px-4 py-3 font-medium">Ярлик (URL)</th>
              <th className="px-4 py-3 font-medium">Статус</th>
              <th className="px-4 py-3 font-medium text-right">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan="4" className="px-4 py-10 text-center">
                  <Loader2 size={24} className="animate-spin text-muted mx-auto" />
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-16 text-center text-muted">
                  <FolderTree size={32} className="mx-auto mb-3 opacity-20" />
                  <p>Категорій не знайдено.</p>
                </td>
              </tr>
            ) : (
              categories.map((cat) => {
                const isActive = cat.isActive !== undefined ? cat.isActive : true;
                return (
                  <tr key={cat._id || cat.id} className="hover:bg-fg/5 transition-colors group">
                    <td className="px-4 py-3 font-medium text-fg">{cat.name}</td>
                    <td className="px-4 py-3 text-muted font-mono text-xs">/{cat.slug}</td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => toggleActiveStatus(cat)} 
                        className={`cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${isActive ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-fg/10 text-muted hover:bg-fg/20'}`}
                      >
                        {isActive ? <Eye size={12} /> : <EyeOff size={12} />} {isActive ? 'Видима' : 'Прихована'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => openModal(cat)} 
                          className="cursor-pointer p-1.5 text-muted hover:text-blue-500 rounded transition-colors"
                          title="Редагувати"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => setCategoryToDelete(cat._id || cat.id)} 
                          className="cursor-pointer p-1.5 text-muted hover:text-red-500 rounded transition-colors"
                          title="Видалити"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>

    {modalForm && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-bg border border-border rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-4 border-b border-border bg-fg/[0.02]">
            <h2 className="font-bold text-lg">{(modalForm._id || modalForm.id) ? 'Редагувати категорію' : 'Нова категорія'}</h2>
            <button 
              onClick={() => setModalForm(null)} 
              className="cursor-pointer p-1 text-muted hover:text-fg rounded"
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSave} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Назва категорії</label>
              <input type="text" value={modalForm.name} onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })} placeholder="напр. Штучний інтелект" className="w-full bg-fg/5 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-industrial-accent" required autoFocus />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Ярлик (URL-шлях)</label>
              <input type="text" value={modalForm.slug} onChange={(e) => setModalForm({ ...modalForm, slug: e.target.value })} placeholder="напр. artificial-intelligence" className="w-full bg-fg/5 border border-border rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-industrial-accent" required />
            </div>
            {(modalForm._id || modalForm.id) && (
              <label className="flex items-center gap-2 cursor-pointer mt-2 w-fit">
                <input type="checkbox" checked={modalForm.isActive !== undefined ? modalForm.isActive : true} onChange={(e) => setModalForm({ ...modalForm, isActive: e.target.checked })} className="cursor-pointer rounded border-border text-industrial-accent focus:ring-industrial-accent bg-transparent" />
                <span className="text-sm text-fg select-none">Видима для користувачів</span>
              </label>
            )}
            <div className="pt-4 flex justify-end gap-2 border-t border-border mt-6">
              <button 
                type="button" 
                onClick={() => setModalForm(null)} 
                className="cursor-pointer px-4 py-2 text-sm font-medium text-muted hover:text-fg transition-colors"
              >
                Скасувати
              </button>
              <button 
                type="submit" 
                disabled={isSaving || !modalForm.name.trim() || !modalForm.slug.trim()} 
                className="cursor-pointer disabled:cursor-not-allowed px-4 py-2 text-sm font-medium bg-fg text-bg rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Зберегти
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {categoryToDelete && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-bg/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-bg border border-border rounded-2xl shadow-2xl w-full max-w-[320px] overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-500"><AlertTriangle size={24} /></div>
            <h3 className="text-lg font-bold mb-2">Видалити категорію?</h3>
            <p className="text-sm text-muted">Ця дія є незворотною. Якщо до цієї категорії прив'язані новини, краще зробіть її "Прихованою".</p>
          </div>
          <div className="flex border-t border-border bg-fg/[0.02]">
            <button 
              onClick={() => setCategoryToDelete(null)} 
              disabled={isDeleting} 
              className="cursor-pointer disabled:cursor-not-allowed flex-1 py-3 text-sm font-medium text-fg hover:bg-fg/5 border-r border-border disabled:opacity-50"
            >
              Скасувати
            </button>
            <button 
              onClick={executeDelete} 
              disabled={isDeleting} 
              className="cursor-pointer disabled:cursor-not-allowed flex-1 py-3 text-sm font-medium text-red-500 hover:bg-red-500/10 flex items-center justify-center gap-2 disabled:opacity-50"
            >
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