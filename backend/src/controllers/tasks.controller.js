const pool = require('../db/pool');

// ─── Helpers ────────────────────────────────────────────────────────────────

const VALID_STATUSES   = ['pending', 'in_progress', 'completed', 'cancelled'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

function validate(body, requireTitle = true) {
  const errors = [];
  if (requireTitle && !body.title?.trim()) errors.push('title is required');
  if (body.title?.trim().length > 255)     errors.push('title must be ≤ 255 characters');
  if (body.status   && !VALID_STATUSES.includes(body.status))     errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
  if (body.priority && !VALID_PRIORITIES.includes(body.priority)) errors.push(`priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
  if (body.due_date && isNaN(Date.parse(body.due_date)))          errors.push('due_date must be a valid ISO date');
  return errors;
}

// ─── Controllers ────────────────────────────────────────────────────────────

/** GET /api/tasks */
async function listTasks(req, res, next) {
  try {
    const { status, priority, search, sort = 'created_at', order = 'desc' } = req.query;

    const conditions = [];
    const values     = [];

    if (status)   { values.push(status);           conditions.push(`status = $${values.length}`);                }
    if (priority) { values.push(priority);          conditions.push(`priority = $${values.length}`);             }
    if (search)   { values.push(`%${search}%`);     conditions.push(`(title ILIKE $${values.length} OR description ILIKE $${values.length})`); }

    const SORT_COLS  = ['created_at', 'updated_at', 'due_date', 'title', 'priority'];
    const sortCol    = SORT_COLS.includes(sort) ? sort : 'created_at';
    const sortOrder  = order === 'asc' ? 'ASC' : 'DESC';

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql   = `SELECT * FROM tasks ${where} ORDER BY ${sortCol} ${sortOrder}`;

    const { rows } = await pool.query(sql, values);
    res.json({ data: rows, total: rows.length });
  } catch (err) { next(err); }
}

/** GET /api/tasks/:id */
async function getTask(req, res, next) {
  try {
    const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Task not found' });
    res.json({ data: rows[0] });
  } catch (err) { next(err); }
}

/** POST /api/tasks */
async function createTask(req, res, next) {
  try {
    const errors = validate(req.body);
    if (errors.length) return res.status(422).json({ errors });

    const { title, description = null, status = 'pending', priority = 'medium', due_date = null } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO tasks (title, description, status, priority, due_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title.trim(), description, status, priority, due_date]
    );
    res.status(201).json({ data: rows[0] });
  } catch (err) { next(err); }
}

/** PUT /api/tasks/:id */
async function updateTask(req, res, next) {
  try {
    const errors = validate(req.body, false);
    if (errors.length) return res.status(422).json({ errors });

    // Fetch existing first
    const existing = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    if (!existing.rows.length) return res.status(404).json({ error: 'Task not found' });

    const current = existing.rows[0];
    const merged  = {
      title:       req.body.title       !== undefined ? req.body.title.trim() : current.title,
      description: req.body.description !== undefined ? req.body.description  : current.description,
      status:      req.body.status      !== undefined ? req.body.status       : current.status,
      priority:    req.body.priority    !== undefined ? req.body.priority     : current.priority,
      due_date:    req.body.due_date    !== undefined ? req.body.due_date     : current.due_date,
    };

    const { rows } = await pool.query(
      `UPDATE tasks
       SET title=$1, description=$2, status=$3, priority=$4, due_date=$5
       WHERE id=$6
       RETURNING *`,
      [merged.title, merged.description, merged.status, merged.priority, merged.due_date, req.params.id]
    );
    res.json({ data: rows[0] });
  } catch (err) { next(err); }
}

/** DELETE /api/tasks/:id */
async function deleteTask(req, res, next) {
  try {
    const { rowCount } = await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'Task not found' });
    res.status(204).send();
  } catch (err) { next(err); }
}

/** GET /api/tasks/stats */
async function getStats(req, res, next) {
  try {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*)                                        AS total,
        COUNT(*) FILTER (WHERE status='pending')       AS pending,
        COUNT(*) FILTER (WHERE status='in_progress')   AS in_progress,
        COUNT(*) FILTER (WHERE status='completed')     AS completed,
        COUNT(*) FILTER (WHERE status='cancelled')     AS cancelled,
        COUNT(*) FILTER (WHERE priority='high')        AS high_priority,
        COUNT(*) FILTER (WHERE due_date < NOW() AND status NOT IN ('completed','cancelled')) AS overdue
      FROM tasks
    `);
    res.json({ data: rows[0] });
  } catch (err) { next(err); }
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask, getStats };
