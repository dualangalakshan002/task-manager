/** Formats an ISO date string to a readable local date. */
export const formatDate = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/** A task is overdue if it is not completed and its due date is before today. */
export const isOverdue = (task) => {
  if (task.status === 'Completed') return false;
  const due = new Date(task.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due < today;
};
