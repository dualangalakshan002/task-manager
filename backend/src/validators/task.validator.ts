import { z } from 'zod';

const priorityEnum = z.enum(['Low', 'Medium', 'High']);
const statusEnum = z.enum(['Pending', 'In Progress', 'Completed']);

export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const notInPast = (value: string) => {
  return value >= getTodayDateString();
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
  dueDate: z.string().min(1, 'Due date is required').optional(),
});