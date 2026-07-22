export function validateTask(form) {
  const errors = {};
  if (!form.title || !form.title.trim()) errors.title = 'Title is required';
  if (!form.priority) errors.priority = 'Priority is required';
  if (!form.status) errors.status = 'Status is required';

  if (!form.dueDate) {
    errors.dueDate = 'Due date is required';
  } else {
    // Compare as YYYY-MM-DD strings to avoid timezone shifts.
    // en-CA locale formats dates as YYYY-MM-DD in the user's LOCAL time.
    const todayStr = new Date().toLocaleDateString('en-CA');
    if (form.dueDate < todayStr) {
      errors.dueDate = 'Due date cannot be earlier than today';
    }
  }
  return errors;
}