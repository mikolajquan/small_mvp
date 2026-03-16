// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  // PostgreSQL unique/FK/check errors
  if (err.code === '23505') return res.status(409).json({ error: 'Duplicate entry' });
  if (err.code === '23503') return res.status(400).json({ error: 'Referenced record does not exist' });
  if (err.code === '22P02') return res.status(400).json({ error: 'Invalid UUID format' });

  const status  = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ error: message });
}

module.exports = errorHandler;
