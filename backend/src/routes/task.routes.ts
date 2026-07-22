import { Router } from 'express';
import {
  getTasks,
  getStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/task.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createTaskSchema, updateTaskSchema } from '../validators/task.validator';

const router = Router();

// Every task route requires a valid JWT.
router.use(authenticate);

router.get('/stats', getStats);       // must come before "/:id"
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', validate(createTaskSchema), createTask);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;
