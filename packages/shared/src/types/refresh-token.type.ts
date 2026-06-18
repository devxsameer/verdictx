import { ObjectId } from 'mongodb';

export interface RefreshToken {
  _id: ObjectId;

  userId: ObjectId;

  tokenHash: string;

  familyId: string;

  expiresAt: Date;

  revokedAt: Date | null;

  lastUsedAt: Date | null;

  ipAddress?: string;

  userAgent?: string;
}
