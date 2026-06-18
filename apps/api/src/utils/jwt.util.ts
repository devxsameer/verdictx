import { env } from '@/config/env.js';
import { JwtPayload } from '@/modules/auth/auth.types.js';
import jwt from 'jsonwebtoken';

export const JWTUtil = {
  signAccessToken(userId: string) {
    return jwt.sign({ sub: userId }, env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });
  },

  verifyAccessToken(token: string) {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload;
  },
};
