import { useState, useEffect } from 'react';
import { PRIORITIES, STATUSES } from '../utils/constants';
import { validateTask } from '../utils/validateTask';

const EMPTY = { title: '', description: '', priority: 'Medium', status: 'Pending', dueDate: '' };

/**
 * Create/Edit modal. Reused for both actions:
 * - if `task` is passed → edit mode (pre-filled)
 * - otherwise → create mode
 */
export default function TaskFormModal({ open, onClose, onSubmit, task, submitting }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [task, open]);

  if (!open) return null;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    const validationErrors = validateTask(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(form);
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">{task ? 'Edit Task' : 'Create Task'}</h2>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              placeholder="e.g. Prepare weekly report"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              placeholder="Optional details..."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Priority *</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              >
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.priority && <p className="mt-1 text-sm text-red-600">{errors.priority}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Status *</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Due Date *</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              min={today}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
            {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? 'Saving...' : task ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
