import Badge from './Badge';
import { STATUS_STYLES, PRIORITY_STYLES } from '../utils/constants';
import { formatDate, isOverdue } from '../utils/format';

/**
 * Renders the list of tasks. Responsive:
 * - Table view on desktop
 * - Stacked card view on mobile
 */
export default function TaskTable({ tasks, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500 dark:border-gray-600">
        No tasks found. Create your first task!
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-gray-200 md:block dark:border-gray-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-t border-gray-100 dark:border-gray-700">
                <td className="px-4 py-3">
                  <div className="font-medium">{task.title}</div>
                  {task.description && (
                    <div className="text-xs text-gray-500 line-clamp-1">{task.description}</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge text={task.priority} className={PRIORITY_STYLES[task.priority]} />
                </td>
                <td className="px-4 py-3">
                  <Badge text={task.status} className={STATUS_STYLES[task.status]} />
                </td>
                <td className="px-4 py-3">
                  <span className={isOverdue(task) ? 'font-medium text-red-600' : ''}>
                    {formatDate(task.dueDate)}
                    {isOverdue(task) && ' (Overdue)'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onEdit(task)} className="mr-3 text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => onDelete(task)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{task.title}</p>
                {task.description && <p className="text-xs text-gray-500">{task.description}</p>}
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge text={task.priority} className={PRIORITY_STYLES[task.priority]} />
              <Badge text={task.status} className={STATUS_STYLES[task.status]} />
            </div>
            <p className={`mt-2 text-sm ${isOverdue(task) ? 'font-medium text-red-600' : 'text-gray-500'}`}>
              Due: {formatDate(task.dueDate)}{isOverdue(task) && ' (Overdue)'}
            </p>
            <div className="mt-3 flex gap-3">
              <button onClick={() => onEdit(task)} className="text-sm text-blue-600">Edit</button>
              <button onClick={() => onDelete(task)} className="text-sm text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
