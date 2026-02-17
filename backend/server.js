// load environment variables
require('dotenv').config();

const db = require('./config/db');
const express = require('express');

async function start() {
  await db.connect();

  const app = express();
  const port = process.env.PORT || 3000;

  app.use(require('cors')());
  app.use(express.json());
  // mount routes
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/users', require('./routes/users'));

  app.get('/', (req, res) => {
    res.send('Hello from backend (Express)');
  });

  // Centralized Error Handler - MUST come after routes
  app.use(require('./middlewares/errorHandler'));

  // Start server only after error handler is registered
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
