// MUST be first: load env before anything reads process.env
require('dotenv').config();

const connectDB = require('./config/database');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

let server;

const start = async () => {
  try {
    await connectDB(); // don't accept traffic without a database
    server = app.listen(PORT, () => {
      console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n${signal} received. Closing server...`);
  if (!server) return process.exit(0);

  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });

  // Force exit if connections hang
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});