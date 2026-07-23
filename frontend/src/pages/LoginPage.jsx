import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, CheckSquare, BarChart3, CheckCircle2, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const nextErrors = {};
    if (!email.trim()) nextErrors.email = 'Email is required';
    if (!password) nextErrors.password = 'Password is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => e.key === 'Enter' && handleSubmit();

  const features = [
    { icon: BarChart3, label: 'Track Progress' },
    { icon: CheckCircle2, label: 'Stay Organized' },
    { icon: Users, label: 'Work Smarter' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Left branding panel */}
      <div className="relative hidden w-1/2 flex-col justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-blue-950 p-16 lg:flex">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <CheckSquare size={32} className="text-blue-500" />
        </div>

        <h1 className="text-6xl font-bold leading-tight">
          Manage<br />
          your <span className="text-blue-500">tasks</span>
        </h1>

        <p className="mt-6 max-w-md text-lg text-gray-400">
          Organize, prioritize, and manage your tasks efficiently — all in one powerful workspace.
        </p>

        <div className="mt-12 flex gap-8">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-gray-300">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                <Icon size={18} className="text-blue-400" />
              </div>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900/60 p-8 shadow-xl">
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <CheckSquare size={20} />
            </div>
            <span className="text-xl font-bold">Task <span className="font-normal text-gray-300">Manager</span></span>
          </div>

          <h2 className="text-center text-2xl font-bold">Welcome back</h2>
          <p className="mb-8 text-center text-sm text-gray-400">
            Sign in to view and manage everything in one place.
          </p>

          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  placeholder='example@test.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={onKeyDown}
                  className="w-full rounded-lg border border-white/10 bg-gray-800/60 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  placeholder='password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={onKeyDown}
                  className="w-full rounded-lg border border-white/10 bg-gray-800/60 py-3 pl-10 pr-10 text-sm outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            Demo: <span className="text-blue-400">admin@test.com</span> / <span className="text-blue-400">123456</span>
          </p>
        </div>
      </div>
    </div>
  );
}