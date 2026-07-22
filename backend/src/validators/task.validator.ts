import { z } from 'zod';

/**
 * Zod schemas = single source of truth for backend validation.
 * These mirror the frontend rules so the two stay consistent.
 */

const priorityEnum = z.enum(['Low', 'Medium', 'High']);
const statusEnum = z.enum(['Pending', 'In Progress', 'Completed']);

// Compares only the date part (ignores time) so "today" is always allowed.
const notInPast = (value: string) => {
  const due = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due.getTime() >= today.getTime();
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

// On update every field is optional, but the past-date rule still applies if present.
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

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});
