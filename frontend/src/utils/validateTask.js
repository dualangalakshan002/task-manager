export function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function validateTask(form, initialTask = null) {
  const errors = {};
  if (!form.title || !form.title.trim()) errors.title = 'Title is required';
  if (!form.priority) errors.priority = 'Priority is required';
  if (!form.status) errors.status = 'Status is required';

  if (!form.dueDate) {
    errors.dueDate = 'Due date is required';
  } else {
    const todayStr = getTodayDateString();
    const initialDueDateStr = initialTask?.dueDate ? String(initialTask.dueDate).slice(0, 10) : '';
    const isDateChanged = !initialTask || form.dueDate !== initialDueDateStr;

    if (isDateChanged && form.dueDate < todayStr) {
      errors.dueDate = 'Due date cannot be earlier than today';
    }
  }
  return errors;
}