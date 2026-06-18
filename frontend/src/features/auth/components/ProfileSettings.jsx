import { useState, useEffect } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { useUpdateProfile } from '../hooks';

export default function ProfileSettings({ user }) {
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [usernameInput, setUsernameInput] = useState(user?.username || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar ? `${BASE_URL}${user.avatar}` : null);
  const [notification, setNotification] = useState(null);

  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  useEffect(() => {
    if (user) {
      setUsernameInput(user.username || '');
      if (!selectedFile) {
        setPreviewUrl(user.avatar ? `${BASE_URL}${user.avatar}` : null);
      }
    }
  }, [user, selectedFile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = () => {
    setNotification(null);

    const formData = new FormData();
    formData.append('username', usernameInput);
    if (selectedFile) {
      formData.append('avatar', selectedFile);
    }

    updateProfile(formData, {
      onSuccess: () => {
        setNotification({ type: 'success', text: 'Профіль успішно оновлено.' });
        setSelectedFile(null);
        setTimeout(() => setNotification(null), 3000);
      },
      onError: (error) => {
        console.error('Update error:', error);
        setNotification({ type: 'error', text: 'Не вдалося оновити профіль.' });
      }
    });
  };

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : '?';

  return (
    <div className="max-w-md animate-in fade-in slide-in-from-bottom-2">
      <h2 className="text-lg font-bold mb-6">Налаштування акаунта</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-mono text-muted mb-3 uppercase">Фото профілю</label>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-border border border-border group cursor-pointer">
              {previewUrl ? (
                <img src={previewUrl} alt="Попередній перегляд" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold">{initial}</div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="absolute inset-0 bg-bg/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Camera size={20} className="text-fg" />
              </div>
            </div>
            <div className="text-sm text-muted">
              <p>Натисніть на зображення, щоб завантажити нове.</p>
              <p className="text-xs">Макс. розмір: 2МБ. JPG, PNG.</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-muted mb-1 uppercase">Ім'я користувача</label>
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="w-full px-3 py-2 bg-fg/5 border border-border rounded-lg text-fg focus:outline-none focus:border-industrial-accent focus:ring-1 focus:ring-industrial-accent transition-all cursor-text"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-muted mb-1 uppercase">Електронна пошта</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-3 py-2 bg-fg/5 border border-border rounded-lg text-muted cursor-not-allowed opacity-70"
          />
        </div>

        {notification && (
          <div className={`p-3 text-sm rounded-lg border animate-in fade-in slide-in-from-top-2 ${notification.type === 'success'
              ? 'bg-green-500/10 border-green-500/20 text-green-500'
              : 'bg-red-500/10 border-red-500/20 text-red-500'
            }`}>
            {notification.text}
          </div>
        )}

        <button
          onClick={handleSaveProfile}
          disabled={isUpdating || (!selectedFile && usernameInput === user?.username)}
          className="cursor-pointer disabled:cursor-not-allowed mt-4 px-4 py-2 bg-fg text-bg text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
        >
          {isUpdating && <Loader2 size={16} className="animate-spin" />}
          Зберегти зміни
        </button>
      </div>
    </div>
  );
}