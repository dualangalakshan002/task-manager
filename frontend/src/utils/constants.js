export const PRIORITIES = ['Low', 'Medium', 'High'];
export const STATUSES = ['Pending', 'In Progress', 'Completed'];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Created' },
  { value: 'oldest', label: 'Oldest Created' },
  { value: 'dueDate', label: 'Due Date' },
];

// Tailwind classes for status/priority badges — kept in one place (no duplication).
export const STATUS_STYLES = {
  Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

export const PRIORITY_STYLES = {
  Low: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  Medium: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  High: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};
