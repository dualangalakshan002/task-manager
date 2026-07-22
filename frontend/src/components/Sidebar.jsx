import { LayoutDashboard, CheckSquare, PlusCircle, Moon, Sun, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar({ onMyTasks, onAddTask, isOpen, onClose }) {
  const { user } = useAuth();
  const { dark, toggle } = useTheme();

  const navItem =
    'flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors';

  const handleNav = (action) => {
    action();
    onClose(); // close the drawer after tapping a nav item on mobile
  };

  return (
    <>
      {/* Dark overlay behind the drawer on mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white p-4 transition-transform dark:border-gray-700/60 dark:bg-gray-900
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:translate-x-0`}
      >
        {/* Logo + close button (close only shows on mobile) */}
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <CheckSquare size={22} />
            </div>
            <span className="text-lg font-bold">Task Manager</span>
          </div>
          <button onClick={onClose} className="lg:hidden" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          <button className={`${navItem} bg-blue-600 text-white`}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => handleNav(onMyTasks)} className={`${navItem} text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800`}>
            <CheckSquare size={18} /> My Tasks
          </button>
          <button onClick={() => handleNav(onAddTask)} className={`${navItem} text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800`}>
            <PlusCircle size={18} /> Add Task
          </button>
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700/60">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              {user?.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.email}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>

          <button
            onClick={toggle}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-sm dark:border-gray-700/60"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>
    </>
  );
}