import type { User } from '@verdictx/shared/types';
import { AuthRepository } from './auth.repository.js';

import { JWTUtil } from '@/utils/jwt.util.js';

import { CryptoUtil } from '@/utils/crypto.util.js';

import { GithubProfile } from './strategies/github.strategy.js';

export const AuthService = {
  async findOrCreateGithubUser(profile: GithubProfile) {
    const existing = await AuthRepository.findByGithubId(profile.githubId);

    if (existing) {
      return existing;
    }

    return AuthRepository.createUser({
      githubId: profile.githubId,
      email: profile.email,
      username: profile.username,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      provider: 'github',
    });
  },

  async issueTokens(
    user: User,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    },
  ) {
    const accessToken = JWTUtil.signAccessToken(user._id.toString());

    const refreshToken = CryptoUtil.generateToken();

    await AuthRepository.saveRefreshToken({
      userId: user._id,

      tokenHash: CryptoUtil.hashToken(refreshToken),

      familyId: CryptoUtil.generateFamilyId(),

      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),

      revokedAt: null,

      lastUsedAt: null,

      ipAddress: metadata?.ipAddress,

      userAgent: metadata?.userAgent,
    });

    return {
      accessToken,
      refreshToken,
    };
  },

  async refresh(
    refreshToken: string,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    },
  ) {
    const tokenHash = CryptoUtil.hashToken(refreshToken);

    const storedToken = await AuthRepository.findValidRefreshToken(tokenHash);

    if (!storedToken) {
      throw new Error('Invalid refresh token');
    }

    if (storedToken.revokedAt) {
      await AuthRepository.revokeFamily(storedToken.familyId);

      throw new Error('Refresh token revoked');
    }

    if (storedToken.expiresAt < new Date()) {
      throw new Error('Refresh token expired');
    }

    await AuthRepository.revokeToken(storedToken._id);

    const user = await AuthRepository.findById(storedToken.userId.toString());

    if (!user) {
      throw new Error('User not found');
    }

    const newRefreshToken = CryptoUtil.generateToken();

    await AuthRepository.saveRefreshToken({
      userId: user._id,

      tokenHash: CryptoUtil.hashToken(newRefreshToken),

      familyId: storedToken.familyId,

      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),

      revokedAt: null,

      lastUsedAt: new Date(),

      ipAddress: metadata?.ipAddress,

      userAgent: metadata?.userAgent,
    });

    return {
      accessToken: JWTUtil.signAccessToken(user._id.toString()),

      refreshToken: newRefreshToken,
    };
  },

  async logout(refreshToken: string) {
    const tokenHash = CryptoUtil.hashToken(refreshToken);

    const storedToken = await AuthRepository.findValidRefreshToken(tokenHash);

    if (!storedToken) {
      return;
    }

    await AuthRepository.revokeToken(storedToken._id);
  },

  async me(userId: string) {
    const user = await AuthRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },
};
