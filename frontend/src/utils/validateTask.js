/**
 * Frontend mirror of the backend Zod rules.
 * Returns an { field: message } object; empty object means valid.
 */
export function validateTask(form) {
  const errors = {};
  if (!form.title || !form.title.trim()) errors.title = 'Title is required';
  if (!form.priority) errors.priority = 'Priority is required';
  if (!form.status) errors.status = 'Status is required';

  if (!form.dueDate) {
    errors.dueDate = 'Due date is required';
  } else {
    const due = new Date(form.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    if (due < today) errors.dueDate = 'Due date cannot be earlier than today';
  }
  return errors;
}
