import { Pool } from 'pg';
import { env } from '../config/env';


export const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err);
});

/** Small helper so callers write `query(sql, params)` instead of `pool.query`. */
export const query = <T extends import('pg').QueryResultRow = any>(
  text: string,
  params?: any[]
) => pool.query<T>(text, params);
