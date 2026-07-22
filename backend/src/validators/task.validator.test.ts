import { createTaskSchema } from './task.validator';

describe('createTaskSchema', () => {
  const base = {
    title: 'Write report',
    priority: 'High',
    status: 'Pending',
    dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10), // tomorrow
  };

  it('accepts a valid task', () => {
    expect(createTaskSchema.safeParse(base).success).toBe(true);
  });

  it('rejects an empty title', () => {
    const result = createTaskSchema.safeParse({ ...base, title: '' });
    expect(result.success).toBe(false);
  });

  it('rejects a due date in the past', () => {
    const result = createTaskSchema.safeParse({ ...base, dueDate: '2000-01-01' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid priority', () => {
    const result = createTaskSchema.safeParse({ ...base, priority: 'Urgent' });
    expect(result.success).toBe(false);
  });
});
