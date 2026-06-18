import type { Request, Response } from 'express';

import { AuthService } from './auth.service.js';

import { env } from '@/config/env.js';
import { refreshCookieOptions } from '@/config/cookies.js';

export const AuthController = {
  async githubCallback(req: Request, res: Response) {
    const profile = req.user as {
      githubId: string;
      email: string;
      username: string;
      name: string;
      avatarUrl: string;
    };

    const user = await AuthService.findOrCreateGithubUser(profile);

    const tokens = await AuthService.issueTokens(user, {
      ipAddress: req.ip,
      userAgent: req.get('user-agent') ?? undefined,
    });

    res.cookie('refreshToken', tokens.refreshToken, refreshCookieOptions);

    res.redirect(`${env.FRONTEND_URL}/auth/callback`);
  },

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token missing',
      });
    }

    const tokens = await AuthService.refresh(refreshToken, {
      ipAddress: req.ip,
      userAgent: req.get('user-agent') ?? undefined,
    });

    res.cookie('refreshToken', tokens.refreshToken, refreshCookieOptions);

    return res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
      },
    });
  },

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await AuthService.logout(refreshToken);
    }

    res.clearCookie('refreshToken', refreshCookieOptions);

    return res.json({
      success: true,
    });
  },

  async me(req: Request, res: Response) {
    const userId = req.user;

    const user = await AuthService.me(userId);

    return res.json({
      success: true,
      data: {
        id: user._id.toString(),

        githubId: user.githubId,

        email: user.email,

        username: user.username,

        name: user.name,

        avatarUrl: user.avatarUrl,

        provider: user.provider,
      },
    });
  },
};
