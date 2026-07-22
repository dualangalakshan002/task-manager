import { z } from 'zod';

const priorityEnum = z.enum(['Low', 'Medium', 'High']);
const statusEnum = z.enum(['Pending', 'In Progress', 'Completed']);

// Compare as YYYY-MM-DD strings to avoid timezone shifts.
// en-CA locale formats dates as YYYY-MM-DD.
const notInPast = (value: string) => {
  const todayStr = new Date().toLocaleDateString('en-CA');
  return value >= todayStr;
};

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.string().trim().max(2000).optional().or(z.literal('')),
  priority: priorityEnum,
  status: statusEnum,
  dueDate: z
    .string()
    .min(1, 'Due date is required')
    .refine(notInPast, 'Due date cannot be earlier than today'),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200).optional(),
  description: z.string().trim().max(2000).optional().or(z.literal('')),
  priority: priorityEnum.optional(),
  status: statusEnum.optional(),
  dueDate: z
    .string()
    .refine(notInPast, 'Due date cannot be earlier than today')
    .optional(),
});