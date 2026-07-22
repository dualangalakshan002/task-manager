import bcrypt from 'bcryptjs';
import { pool } from './pool';
import { env } from '../config/env';

async function seed() {
  try {
    const hashed = await bcrypt.hash(env.admin.password, 10);

    await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      [env.admin.name, env.admin.email, hashed]
    );

    console.log(`✅ Seed complete. Login with ${env.admin.email} / ${env.admin.password}`);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();
