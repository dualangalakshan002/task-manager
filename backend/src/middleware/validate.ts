import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Generic validation middleware.
 * Parses req.body against a Zod schema; on failure returns 400 with
 * field-level messages the frontend can display next to each input.
 */
export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path.join('.') || 'form';
        if (!errors[field]) errors[field] = issue.message;
      }
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    req.body = result.data; // sanitized/typed data
    next();
  };
