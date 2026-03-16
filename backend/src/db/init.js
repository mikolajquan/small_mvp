const pool = require('./pool');

const schema = `
  CREATE EXTENSION IF NOT EXISTS "pgcrypto";

  CREATE TABLE IF NOT EXISTS tasks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(255)  NOT NULL,
    description TEXT,
    status      VARCHAR(50)   NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending','in_progress','completed','cancelled')),
    priority    VARCHAR(20)   NOT NULL DEFAULT 'medium'
                              CHECK (priority IN ('low','medium','high')),
    due_date    TIMESTAMPTZ,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
  );

  CREATE OR REPLACE FUNCTION set_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  DROP TRIGGER IF EXISTS tasks_updated_at ON tasks;
  CREATE TRIGGER tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
`;

async function init() {
  const client = await pool.connect();
  try {
    await client.query(schema);
    console.log('✅  Database schema initialised');
  } catch (err) {
    console.error('❌  Schema init failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

init();
