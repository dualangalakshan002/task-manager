import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <h1 className="text-lg font-semibold">📋 Task Manager</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600"
            aria-label="Toggle dark mode"
          >
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>
          <span className="hidden text-sm text-gray-500 sm:inline dark:text-gray-400">
            {user?.email}
          </span>
          <button
            onClick={logout}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
