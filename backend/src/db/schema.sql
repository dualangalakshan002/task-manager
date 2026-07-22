

CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(120)     NOT NULL,
  email       VARCHAR(180)     NOT NULL UNIQUE,
  password    VARCHAR(255)     NOT NULL,          -- bcrypt hash
  created_at  TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(200)     NOT NULL,
  description TEXT,
  priority    VARCHAR(10)      NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
  status      VARCHAR(20)      NOT NULL CHECK (status IN ('Pending', 'In Progress', 'Completed')),
  due_date    DATE             NOT NULL,
  created_at  TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- Indexes to speed up the common queries (filter + search + sort).
CREATE INDEX IF NOT EXISTS idx_tasks_user_id   ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status    ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority  ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date  ON tasks(due_date);

-- Trigger to keep updated_at fresh on every UPDATE.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_tasks_updated_at ON tasks;
CREATE TRIGGER trg_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
