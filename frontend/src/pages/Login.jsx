import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';

const InputField = ({ icon: Icon, type, name, placeholder, value, onChange, autoFocus }) => (
  <div className="relative group">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted group-focus-within:text-industrial-accent transition-colors">
      <Icon size={18} />
    </div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoFocus={autoFocus}
      className="w-full pl-10 pr-4 py-2.5 bg-fg/5 border border-border rounded-xl text-fg placeholder:text-muted focus:outline-none focus:border-industrial-accent focus:ring-1 focus:ring-industrial-accent transition-all"
    />
  </div>
);

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isLoading, error: authError } = useAuthStore();
  const { theme } = useThemeStore();

  const [isLoginMode, setIsLoginMode] = useState(location.pathname === '/login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [validationError, setValidationError] = useState('');

  const logoSrc = theme === 'dark' ? '/logo-light.png' : '/logo-dark.png';

  useEffect(() => {
    setIsLoginMode(location.pathname === '/login');
    setValidationError('');
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    useAuthStore.setState({ error: null });
  }, [location.pathname]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.email || !formData.password || (!isLoginMode && (!formData.username || !formData.confirmPassword))) {
      setValidationError('Будь ласка, заповніть усі поля.');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Пароль має містити щонайменше 6 символів.');
      return;
    }

    if (!isLoginMode && formData.password !== formData.confirmPassword) {
      setValidationError('Паролі не збігаються.');
      return;
    }

    let success;
    if (isLoginMode) {
      success = await login(formData.email, formData.password);
    } else {
      success = await register(formData.username, formData.email, formData.password);
    }

    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-12 relative w-full">

      <Link
        to="/"
        className="cursor-pointer absolute top-6 left-6 z-10"
      >
        <img
          src={logoSrc}
          alt="CubeIT"
          className="h-8 md:h-10 w-auto object-contain"
        />
      </Link>

      <div className="w-full max-w-md p-8 bg-bg/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl relative overflow-hidden mt-8 md:mt-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-industrial-accent to-transparent opacity-50" />

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            {isLoginMode ? 'З поверненням' : 'Створити акаунт'}
          </h1>
        </div>

        {(validationError || authError) && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-500 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{validationError || authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <InputField
              icon={User}
              type="text"
              name="username"
              placeholder="Ім'я користувача"
              value={formData.username}
              onChange={handleChange}
              autoFocus={!isLoginMode}
              className="cursor-text"
            />
          )}

          <InputField
            icon={Mail}
            type="email"
            name="email"
            placeholder="Електронна пошта"
            value={formData.email}
            onChange={handleChange}
            autoFocus={isLoginMode}
            className="cursor-text"
          />

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted group-focus-within:text-industrial-accent transition-colors">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-2.5 bg-fg/5 border border-border rounded-xl text-fg placeholder:text-muted focus:outline-none focus:border-industrial-accent focus:ring-1 focus:ring-industrial-accent transition-all cursor-text"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-fg transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {!isLoginMode && (
            <div className="relative group animate-in fade-in slide-in-from-top-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted group-focus-within:text-industrial-accent transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Підтвердіть пароль"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-2.5 bg-fg/5 border border-border rounded-xl text-fg placeholder:text-muted focus:outline-none focus:border-industrial-accent focus:ring-1 focus:ring-industrial-accent transition-all cursor-text"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="cursor-pointer absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-fg transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer disabled:cursor-not-allowed w-full py-2.5 px-4 mt-2 bg-fg text-bg font-medium rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              isLoginMode ? 'Вхід' : 'Реєстрація'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted">
          {isLoginMode ? "Немає акаунту? " : "Вже є акаунт? "}
          <Link
            to={isLoginMode ? '/register' : '/login'}
            className="cursor-pointer font-medium text-fg hover:text-industrial-accent transition-colors underline-offset-4 hover:underline"
          >
            {isLoginMode ? 'Реєстрація' : 'Вхід'}
          </Link>
        </div>

      </div>
    </div>
  );
}