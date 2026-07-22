import { X } from 'lucide-react';
import TaskTable from './TaskTable';
import TaskFilters from './TaskFilters';

export default function MyTasksModal({ open, onClose, tasks, filters, onFilterChange, onEdit, onDelete }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[85vh] w-full max-w-4xl flex-col rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">My Tasks</h2>
          <button onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <TaskFilters filters={filters} onChange={onFilterChange} />
        </div>

        {/* Scrollable task list */}
        <div className="overflow-y-auto">
          <TaskTable tasks={tasks} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}