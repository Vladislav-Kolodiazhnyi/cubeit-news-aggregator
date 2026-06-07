import { useState } from 'react';
import { Loader2, Trash2, Shield, ShieldOff, AlertCircle, CheckCircle, AlertTriangle, Users, Mail, Calendar } from 'lucide-react';

import useAuthStore from '../../../store/useAuthStore';
import { useAdminUsers, useUpdateUserRole, useDeleteUser } from '../hooks';
import Pagination from '../../../components/ui/Pagination';

export default function AdminUsersTab() {
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const { user: currentUser } = useAuthStore();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [userToDelete, setUserToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const { data: usersData, isLoading } = useAdminUsers(page, limit);
  const { mutate: changeRole } = useUpdateUserRole();
  const { mutate: removeUser, isPending: isDeleting } = useDeleteUser();

  const users = usersData?.data?.users || usersData?.data || [];
  const totalPages = usersData?.meta?.totalPages || 1;

  const toggleRole = (targetUser) => {
    const id = targetUser._id || targetUser.id;
    if (id === (currentUser._id || currentUser.id)) {
      return showToast("Ви не можете змінити власну роль", "error");
    }

    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    const roleNameUk = newRole === 'admin' ? 'Адміністратор' : 'Користувач';

    changeRole({ id, role: newRole }, {
      onSuccess: () => showToast(`Роль користувача оновлено на "${roleNameUk}"`),
      onError: () => showToast('Не вдалося змінити роль', 'error')
    });
  };

  const executeDelete = () => {
    if (!userToDelete) return;
    removeUser(userToDelete, {
      onSuccess: () => { setUserToDelete(null); showToast('Користувача назавжди видалено'); },
      onError: () => showToast('Не вдалося видалити користувача', 'error')
    });
  };

  const isMe = (id) => id === (currentUser._id || currentUser.id);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 relative pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Управління користувачами</h1>
      </div>

      <div className="bg-bg border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-fg/[0.02] border-b border-border text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Користувач</th>
                <th className="px-4 py-3 font-medium">Контакти</th>
                <th className="px-4 py-3 font-medium">Роль</th>
                <th className="px-4 py-3 font-medium">Приєднався(лася)</th>
                <th className="px-4 py-3 font-medium text-right">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan="5" className="px-4 py-10 text-center"><Loader2 size={24} className="animate-spin text-muted mx-auto" /></td></tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-16 text-center text-muted">
                    <Users size={32} className="mx-auto mb-3 opacity-20" /><p>Користувачів не знайдено.</p>
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const id = u._id || u.id;
                  const currentUserIsMe = isMe(id);
                  return (
                    <tr key={id} className={`hover:bg-fg/5 transition-colors ${currentUserIsMe ? 'bg-fg/[0.02]' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-border shrink-0 flex items-center justify-center text-xs font-bold overflow-hidden">
                            {u.avatar ? <img src={`${BASE_URL}${u.avatar}`} alt={u.username} className="w-full h-full object-cover" /> : u.username?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div className="font-medium text-fg flex items-center gap-2">
                            {u.username} {currentUserIsMe && <span className="text-[10px] bg-industrial-accent/10 text-industrial-accent px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Ви</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted flex items-center gap-1.5"><Mail size={14} className="opacity-50" />{u.email}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleRole(u)} disabled={currentUserIsMe} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${u.role === 'admin' ? 'bg-industrial-accent/10 text-industrial-accent hover:bg-industrial-accent/20' : 'bg-fg/10 text-muted hover:bg-fg/20'} ${currentUserIsMe ? 'cursor-not-allowed opacity-70' : ''}`}>
                          {u.role === 'admin' ? <Shield size={12} /> : <ShieldOff size={12} />} {u.role === 'admin' ? 'Адмін' : 'Користувач'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-muted text-xs font-mono flex items-center gap-1.5"><Calendar size={14} className="opacity-50" />{new Date(u.createdAt).toLocaleDateString('uk-UA')}</td>
                      <td className="px-4 py-3 text-right">
                        {!currentUserIsMe && <button onClick={() => setUserToDelete(id)} className="p-1.5 text-muted hover:text-red-500 rounded transition-colors"><Trash2 size={16} /></button>}
                      </td>
                    </tr>
                  );
                })
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

      {userToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-bg/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-bg border border-border rounded-2xl shadow-2xl w-full max-w-[320px] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-500"><AlertTriangle size={24} /></div>
              <h3 className="text-lg font-bold mb-2">Видалити користувача?</h3>
              <p className="text-sm text-muted">Ця дія є незворотною. Усі дані, пов'язані з цим користувачем, будуть видалені.</p>
            </div>
            <div className="flex border-t border-border bg-fg/[0.02]">
              <button onClick={() => setUserToDelete(null)} disabled={isDeleting} className="flex-1 py-3 text-sm font-medium text-fg hover:bg-fg/5 border-r border-border disabled:opacity-50">Скасувати</button>
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