import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import TaskFilters from '../components/TaskFilters';
import TaskTable from '../components/TaskTable';
import TaskFormModal from '../components/TaskFormModal';
import Spinner from '../components/Spinner';
import { useDebounce } from '../hooks/useDebounce';
import {
  fetchTasks, fetchStats, createTask, updateTask, deleteTask,
} from '../api/tasks.api';

const DEFAULT_FILTERS = { search: '', status: '', priority: '', sort: 'newest' };

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
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
        page,
        limit: 10,
      });
      setTasks(res.data);
      setPagination(res.pagination);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters.status, filters.priority, filters.sort, page]);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { loadTasks(); }, [loadTasks]);

  // Reset to page 1 whenever a filter changes.
  useEffect(() => { setPage(1); }, [debouncedSearch, filters.status, filters.priority, filters.sort]);

  const refresh = () => { loadTasks(); loadStats(); };

  const handleCreate = () => { setEditingTask(null); setModalOpen(true); };
  const handleEdit = (task) => { setEditingTask(task); setModalOpen(true); };

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
      setModalOpen(false);
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
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* Dashboard stats */}
        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Total" value={stats?.total ?? '-'} accent="text-gray-900 dark:text-white" />
          <StatCard label="Pending" value={stats?.pending ?? '-'} accent="text-yellow-600" />
          <StatCard label="In Progress" value={stats?.inProgress ?? '-'} accent="text-blue-600" />
          <StatCard label="Completed" value={stats?.completed ?? '-'} accent="text-green-600" />
          <StatCard label="Overdue" value={stats?.overdue ?? '-'} accent="text-red-600" />
        </section>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Tasks</h2>
          <button onClick={handleCreate}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            + New Task
          </button>
        </div>

        <div className="mb-4">
          <TaskFilters filters={filters} onChange={setFilters} />
        </div>

        {loading ? (
          <Spinner label="Loading tasks..." />
        ) : (
          <>
            <TaskTable tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />

            {/* Pagination (bonus) */}
            {pagination.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-gray-600"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-gray-600"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <TaskFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        task={editingTask}
        submitting={submitting}
      />
    </div>
  );
}
