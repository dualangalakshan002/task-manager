import fs from 'fs';
import path from 'path';
import { pool } from './pool';

/**
 * Runs schema.sql against the configured database.
 * Usage: npm run migrate
 */
async function migrate() {
  const sql = fs.readFileSync(path.resolve(__dirname, '../../../database/schema.sql'), 'utf-8');
  try {
    await pool.query(sql);
    console.log('✅ Migration complete: tables, indexes and triggers created.');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

migrate();
