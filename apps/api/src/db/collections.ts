import { RefreshToken, User } from '@verdictx/shared/types';
import { getDb } from './mongodb.js';

export const collections = {
  users: () => getDb().collection<User>('users'),

  refreshTokens: () => getDb().collection<RefreshToken>('refresh_tokens'),

  resumes: () => getDb().collection('resumes'),

  interviews: () => getDb().collection('interviews'),

  questions: () => getDb().collection('questions'),

  reports: () => getDb().collection('reports'),
};
