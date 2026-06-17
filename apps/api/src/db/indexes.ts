import { collections } from './collections.js';

export async function createIndexes() {
  await collections.users().createIndex({ email: 1 }, { unique: true });

  await collections.refreshTokens().createIndex({
    userId: 1,
  });

  await collections.interviews().createIndex({
    userId: 1,
  });

  await collections.questions().createIndex({
    interviewId: 1,
  });

  console.log('✅ Indexes created');
}
