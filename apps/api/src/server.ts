// src/server.ts
import 'dotenv/config';
import app from '@/app.js';
import { env } from '@/config/env.js';
import { connectDatabase, disconnectDatabase } from './db/mongodb.js';

const PORT = env.PORT || 6969;

await connectDatabase();

const server = app.listen(PORT, () => {
  console.log(
    `✅ blog-api running on http://localhost:${PORT} (${env.NODE_ENV || 'development'})`,
  );
});

// Graceful shutdown
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

async function shutdown() {
  console.log('🛑 Shutting down server...');

  await disconnectDatabase();

  server.close(() => {
    console.log('✅ Server closed cleanly');
    process.exit(0);
  });
}
