import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db/pool';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

interface UserRow {
  id: number;
  name: string;
  email: string;
  password: string;
}


export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await query<UserRow>(
    'SELECT id, name, email, password FROM users WHERE email = $1',
    [email]
  );
  const user = result.rows[0];

  // Same generic message whether the email or password is wrong (avoids user enumeration).
  if (!user) throw new ApiError(401, 'Invalid email or password');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new ApiError(401, 'Invalid email or password');

  const token = jwt.sign({ userId: user.id }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  } as jwt.SignOptions);

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});
