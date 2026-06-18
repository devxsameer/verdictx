import { UnauthorizedError } from '@/errors/http.errors.js';
import { JWTUtil } from '@/utils/jwt.util.js';
import { RequestHandler } from 'express';

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header) throw new UnauthorizedError();

  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) throw new UnauthorizedError();

  try {
    const payload = JWTUtil.verifyAccessToken(token);

    req.user = {
      id: payload.sub!,
    };

    next();
  } catch {
    throw new UnauthorizedError();
  }
};
