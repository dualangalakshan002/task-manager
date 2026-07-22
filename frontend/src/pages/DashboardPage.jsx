import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Layers, Clock, PlayCircle, CheckCircle2, AlertCircle, Plus, LogOut, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import TaskTable from '../components/TaskTable';
import TaskFilters from '../components/TaskFilters';
import TaskFormModal from '../components/TaskFormModal';
import MyTasksModal from '../components/MyTasksModal';
import Spinner from '../components/Spinner';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../context/AuthContext';
import {
  fetchTasks, fetchStats, createTask, updateTask, deleteTask,
} from '../api/tasks.api';

export default function DashboardPage() {
  const { logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', sort: 'newest' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [myTasksOpen, setMyTasksOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const debouncedSearch = useDebounce(filters.search, 400);

  const loadStats = useCallback(async () => {
    try {
      setStats(await fetchStats());
    } catch {
      toast.error('Failed to load stats');
    }
  }, []);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchTasks({
        search: debouncedSearch || undefined,
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        sort: filters.sort,
      });
      setTasks(res.data);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters.status, filters.priority, filters.sort]);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { loadTasks(); }, [loadTasks]);

  const refresh = () => { loadTasks(); loadStats(); };

  const openCreate = () => { setEditingTask(null); setFormOpen(true); };
  const openEdit = (task) => { setEditingTask(task); setFormOpen(true); };

  const handleSubmit = async (form) => {
    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description?.trim() || '',
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate,
      };
      if (editingTask) {
        await updateTask(editingTask.id, payload);
        toast.success('Task updated');
      } else {
        await createTask(payload);
        toast.success('Task created');
      }
      setFormOpen(false);
      refresh();
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      toast.error(apiErrors ? Object.values(apiErrors)[0] : 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try {
      await deleteTask(task.id);
      toast.success('Task deleted');
      refresh();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar
        onMyTasks={() => setMyTasksOpen(true)}
        onAddTask={openCreate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="mr-3 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back! Here's what's happening with your tasks.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={openCreate}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:flex-none">
              <Plus size={18} /> Add New Task
            </button>
            <button onClick={logout}
              className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard label="Total Tasks" value={stats?.total ?? '-'} subtitle="All tasks in the system"
            icon={Layers} iconColor="bg-blue-500/20 text-blue-500" barColor="bg-blue-500" />
          <StatCard label="Pending" value={stats?.pending ?? '-'} subtitle="Tasks waiting to be done"
            icon={Clock} iconColor="bg-yellow-500/20 text-yellow-500" barColor="bg-yellow-500" />
          <StatCard label="In Progress" value={stats?.inProgress ?? '-'} subtitle="Tasks currently in progress"
            icon={PlayCircle} iconColor="bg-teal-500/20 text-teal-500" barColor="bg-teal-500" />
          <StatCard label="Completed" value={stats?.completed ?? '-'} subtitle="Tasks completed"
            icon={CheckCircle2} iconColor="bg-green-500/20 text-green-500" barColor="bg-green-500" />
          <StatCard label="Overdue" value={stats?.overdue ?? '-'} subtitle="Tasks past due date"
            icon={AlertCircle} iconColor="bg-red-500/20 text-red-500" barColor="bg-red-500" />
        </section>

        {/* Filters + task list */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700/60 dark:bg-gray-800/40">
          <div className="mb-4">
            <TaskFilters filters={filters} onChange={setFilters} />
          </div>
          {loading ? (
            <Spinner label="Loading tasks..." />
          ) : (
            <TaskTable tasks={tasks} onEdit={openEdit} onDelete={handleDelete} />
          )}
        </div>
      </main>

      {/* Popups */}
      <TaskFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        task={editingTask}
        submitting={submitting}
      />

      <MyTasksModal
        open={myTasksOpen}
        onClose={() => setMyTasksOpen(false)}
        tasks={tasks}
        filters={filters}
        onFilterChange={setFilters}
        onEdit={(task) => { setMyTasksOpen(false); openEdit(task); }}
        onDelete={handleDelete}
      />
    </div>
  );
}