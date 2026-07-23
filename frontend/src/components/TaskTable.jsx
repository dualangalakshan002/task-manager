import Badge from './Badge';
import { STATUS_STYLES, PRIORITY_STYLES } from '../utils/constants';
import { formatDate, isOverdue } from '../utils/format';

function TaskDueDateDisplay({ task, prefix = '' }) {
  const overdue = isOverdue(task);
  return (
    <span className={overdue ? 'font-medium text-red-600 dark:text-red-400' : ''}>
      {prefix}{formatDate(task.dueDate)}
      {overdue && ' (Overdue)'}
    </span>
  );
}

function TaskActions({ task, onEdit, onDelete, isMobile = false }) {
  const btnClass = isMobile
    ? 'text-sm text-blue-600 hover:underline dark:text-blue-400'
    : 'mr-3 text-blue-600 hover:underline dark:text-blue-400';
  const deleteBtnClass = isMobile
    ? 'text-sm text-red-600 hover:underline dark:text-red-400'
    : 'text-red-600 hover:underline dark:text-red-400';

  return (
    <div className={isMobile ? 'mt-3 flex gap-3' : ''}>
      <button onClick={() => onEdit(task)} className={btnClass}>Edit</button>
      <button onClick={() => onDelete(task)} className={deleteBtnClass}>Delete</button>
    </div>
  );
}

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
                    <div className="text-xs text-gray-500 line-clamp-1 dark:text-gray-400">{task.description}</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge text={task.priority} className={PRIORITY_STYLES[task.priority]} />
                </td>
                <td className="px-4 py-3">
                  <Badge text={task.status} className={STATUS_STYLES[task.status]} />
                </td>
                <td className="px-4 py-3">
                  <TaskDueDateDisplay task={task} />
                </td>
                <td className="px-4 py-3 text-right">
                  <TaskActions task={task} onEdit={onEdit} onDelete={onDelete} />
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
                {task.description && <p className="text-xs text-gray-500 dark:text-gray-400">{task.description}</p>}
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge text={task.priority} className={PRIORITY_STYLES[task.priority]} />
              <Badge text={task.status} className={STATUS_STYLES[task.status]} />
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              <TaskDueDateDisplay task={task} prefix="Due: " />
            </p>
            <TaskActions task={task} onEdit={onEdit} onDelete={onDelete} isMobile />
          </div>
        ))}
      </div>
    </>
  );
}
