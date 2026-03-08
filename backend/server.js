// load environment variables
require('dotenv').config();

const db = require('./config/db');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');

async function start() {
  await db.connect();

  const app = express();
  const port = process.env.PORT || 3000;

  app.use(require('cors')());
  app.use(express.json());
  // mount routes
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/users', require('./routes/users'));
  app.use('/api/opportunities', require('./routes/opportunities'));
  app.use('/api/chat', require('./routes/chat'));

  app.get('/', (req, res) => {
    res.send('Hello from backend (Express)');
  });

  // Centralized Error Handler - MUST come after routes
  app.use(require('./middlewares/errorHandler'));

  // create http server & socket.io
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  // helper to verify token and attach user info
  const verifyToken = (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'changeme');
    } catch (e) {
      return null;
    }
  };

  io.on('connection', (socket) => {
    // grab token from handshake auth
    const token = socket.handshake.auth?.token;
    const decoded = token ? verifyToken(token.replace(/^Bearer\s/, '')) : null;
    if (decoded) {
      socket.user = decoded; // { id, role }
    }

    socket.on('join_room', ({ roomId }) => {
      if (roomId) socket.join(roomId);
    });

    socket.on('send_message', async ({ roomId, content }) => {
      const senderId = socket.user?.id || null;
      const msg = await Message.create({ roomId, sender: senderId, content });
      io.to(roomId).emit('receive_message', {
        sender: senderId,
        content,
        timestamp: msg.createdAt
      });
    });

    // optional: handle disconnects etc.
  });

  // start http server instead of app
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
