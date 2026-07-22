import dotenv from 'dotenv';

dotenv.config();

function required(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 5000),
  nodeEnv: process.env.NODE_ENV ?? 'development',

  db: {
    host: required('DB_HOST', 'localhost'),
    port: Number(process.env.DB_PORT ?? 5432),
    user: required('DB_USER', 'postgres'),
    password: required('DB_PASSWORD', 'postgres'),
    name: required('DB_NAME', 'task_manager'),
  },

  jwt: {
    secret: required('JWT_SECRET', 'dev_secret_change_me'),
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  },

  admin: {
    email: required('ADMIN_EMAIL', 'admin@test.com'),
    password: required('ADMIN_PASSWORD', '123456'),
    name: required('ADMIN_NAME', 'Admin User'),
  },

  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
};
