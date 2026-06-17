import { getDb } from './mongodb.js';

export const collections = {
  users: () => getDb().collection('users'),

  refreshTokens: () => getDb().collection('refresh_tokens'),

  resumes: () => getDb().collection('resumes'),

  interviews: () => getDb().collection('interviews'),

  questions: () => getDb().collection('questions'),

  reports: () => getDb().collection('reports'),
};
