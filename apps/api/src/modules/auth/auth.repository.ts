import { collections } from '@/db/collections.js';
import { toObjectId } from '@/db/mongodb.js';
import { RefreshToken, User } from '@verdictx/shared/types';
import { ObjectId } from 'mongodb';

export const AuthRepository = {
  async findByGithubId(githubId: string) {
    return collections.users().findOne({ githubId });
  },

  async findById(id: string) {
    return collections.users().findOne({ _id: toObjectId(id) });
  },

  async createUser(data: Omit<User, '_id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date();

    const user: User = {
      _id: new ObjectId(),
      githubId: data.githubId,
      email: data.email,
      username: data.username,
      name: data.name,
      avatarUrl: data.avatarUrl,
      provider: 'github',
      createdAt: now,
      updatedAt: now,
    };

    await collections.users().insertOne(user);

    return user;
  },

  async saveRefreshToken(data: Omit<RefreshToken, '_id'>) {
    const token: RefreshToken = {
      _id: new ObjectId(),

      userId: data.userId,

      tokenHash: data.tokenHash,

      familyId: data.familyId,

      expiresAt: data.expiresAt,

      revokedAt: data.revokedAt ?? null,

      lastUsedAt: data.lastUsedAt ?? null,

      ipAddress: data.ipAddress,

      userAgent: data.userAgent,
    };

    await collections.refreshTokens().insertOne(token);

    return token;
  },

  async findValidRefreshToken(tokenHash: string) {
    return collections.refreshTokens().findOne({
      tokenHash,
      revokedAt: null,
      expiresAt: {
        $gt: new Date(),
      },
    });
  },

  async revokeToken(tokenId: ObjectId) {
    await collections.refreshTokens().updateOne(
      {
        _id: tokenId,
      },
      {
        $set: {
          revokedAt: new Date(),
        },
      },
    );
  },

  async revokeFamily(familyId: string) {
    await collections.refreshTokens().updateMany(
      {
        familyId,

        revokedAt: null,
      },
      {
        $set: {
          revokedAt: new Date(),
        },
      },
    );
  },

  async updateLastUsed(tokenId: ObjectId) {
    await collections.refreshTokens().updateOne(
      {
        _id: tokenId,
      },
      {
        $set: {
          lastUsedAt: new Date(),
        },
      },
    );
  },
};
