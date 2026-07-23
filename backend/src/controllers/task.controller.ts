import { Request, Response } from 'express';
import { query } from '../db/pool';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { getTodayDateString } from '../validators/task.validator';

export interface TaskRow {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  due_date: string | Date;
  created_at: string | Date;
  updated_at: string | Date;
}

/**
 * Maps a DB row (snake_case) to the API shape (camelCase).
 * Keeps the wire format clean and decoupled from column names.
 */
const toTask = (row: TaskRow) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  priority: row.priority,
  status: row.status,
  dueDate: row.due_date,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// Whitelist for sort options → prevents SQL injection via the `sort` query param.
const SORT_MAP: Record<string, string> = {
  newest: 'created_at DESC',
  oldest: 'created_at ASC',
  dueDate: 'due_date ASC',
};

/**
 * GET /api/tasks
 * Supports: ?search=  &status=  &priority=  &sort=  &page=  &limit=
 * Search / filter / sort / pagination are all done in SQL for efficiency.
 */
export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { search, status, priority, sort = 'newest' } = req.query;

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const offset = (page - 1) * limit;

  const where: string[] = ['user_id = $1'];
  const params: any[] = [userId];

  if (search) {
    params.push(`%${String(search).trim()}%`);
    where.push(`title ILIKE $${params.length}`);
  }
  if (status) {
    params.push(status);
    where.push(`status = $${params.length}`);
  }
  if (priority) {
    params.push(priority);
    where.push(`priority = $${params.length}`);
  }

  const whereClause = `WHERE ${where.join(' AND ')}`;
  const orderBy = SORT_MAP[String(sort)] ?? SORT_MAP.newest;

  // Total count (for pagination metadata) using the same filters.
  const countResult = await query<{ count: string }>(
    `SELECT COUNT(*)::int AS count FROM tasks ${whereClause}`,
    params
  );
  const total = Number(countResult.rows[0].count);

  // Page of rows.
  const dataParams = [...params, limit, offset];
  const dataResult = await query(
    `SELECT * FROM tasks ${whereClause}
     ORDER BY ${orderBy}
     LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
    dataParams
  );

  res.json({
    data: dataResult.rows.map(toTask),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
});

/**
 * GET /api/tasks/stats
 * Dashboard counters computed in a single query.
 * Overdue = due date in the past AND not yet Completed.
 */
export const getStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const result = await query(
    `SELECT
       COUNT(*)                                                              AS total,
       COUNT(*) FILTER (WHERE status = 'Pending')                            AS pending,
       COUNT(*) FILTER (WHERE status = 'In Progress')                        AS in_progress,
       COUNT(*) FILTER (WHERE status = 'Completed')                          AS completed,
       COUNT(*) FILTER (WHERE status <> 'Completed' AND due_date < CURRENT_DATE) AS overdue
     FROM tasks WHERE user_id = $1`,
    [userId]
  );

  const r = result.rows[0];
  res.json({
    total: Number(r.total),
    pending: Number(r.pending),
    inProgress: Number(r.in_progress),
    completed: Number(r.completed),
    overdue: Number(r.overdue),
  });
});

/** GET /api/tasks/:id */
export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const result = await query(
    'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
    [req.params.id, userId]
  );
  if (result.rows.length === 0) throw new ApiError(404, 'Task not found');
  res.json(toTask(result.rows[0]));
});

/** POST /api/tasks */
export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { title, description, priority, status, dueDate } = req.body;

  const result = await query(
    `INSERT INTO tasks (user_id, title, description, priority, status, due_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, title, description || null, priority, status, dueDate]
  );
  res.status(201).json(toTask(result.rows[0]));
});

/** PUT /api/tasks/:id — partial update, only provided fields change. */
export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const fields = req.body;

  // If due date is being modified, ensure it is not being changed to a new past date.
  if (fields.dueDate !== undefined) {
    const existing = await query<TaskRow>(
      'SELECT due_date FROM tasks WHERE id = $1 AND user_id = $2',
      [req.params.id, userId]
    );
    if (existing.rows.length === 0) throw new ApiError(404, 'Task not found');

    const existingDueDateStr = new Date(existing.rows[0].due_date).toISOString().slice(0, 10);
    const newDueDateStr = String(fields.dueDate).slice(0, 10);

    if (newDueDateStr !== existingDueDateStr && newDueDateStr < getTodayDateString()) {
      throw new ApiError(400, 'Due date cannot be earlier than today');
    }
  }

  const columnMap: Record<string, string> = {
    title: 'title',
    description: 'description',
    priority: 'priority',
    status: 'status',
    dueDate: 'due_date',
  };

  const sets: string[] = [];
  const params: any[] = [];

  for (const [key, column] of Object.entries(columnMap)) {
    if (fields[key] !== undefined) {
      params.push(key === 'description' ? fields[key] || null : fields[key]);
      sets.push(`${column} = $${params.length}`);
    }
  }

  if (sets.length === 0) throw new ApiError(400, 'No valid fields to update');

  params.push(req.params.id, userId);
  const result = await query<TaskRow>(
    `UPDATE tasks SET ${sets.join(', ')}
     WHERE id = $${params.length - 1} AND user_id = $${params.length}
     RETURNING *`,
    params
  );

  if (result.rows.length === 0) throw new ApiError(404, 'Task not found');
  res.json(toTask(result.rows[0]));
});

/** DELETE /api/tasks/:id */
export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const result = await query(
    'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
    [req.params.id, userId]
  );
  if (result.rows.length === 0) throw new ApiError(404, 'Task not found');
  res.status(204).send();
});
