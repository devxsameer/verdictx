import { MongoClient, Db, ObjectId } from 'mongodb';
import { env } from '@/config/env.js';

let client: MongoClient;
let db: Db;

export async function connectDatabase() {
  client = new MongoClient(env.DATABASE_URL);

  await client.connect();

  db = client.db('verdictx');

  console.log('✅ MongoDB connected');

  return db;
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized');
  }

  return db;
}

export async function disconnectDatabase() {
  await client.close();
}

export function toObjectId(id: string) {
  return new ObjectId(id);
}
