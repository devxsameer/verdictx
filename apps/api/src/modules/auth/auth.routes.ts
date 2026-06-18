import { Router } from 'express';
import passport from 'passport';

import { AuthController } from './auth.controller.js';

import { requireAuth } from '@/middlewares/auth.middleware.js';
import { UnauthorizedError } from '@/errors/http.errors.js';

const authRouter: Router = Router();

authRouter.get(
  '/github',
  passport.authenticate('github', {
    scope: ['user:email'],
    session: false,
  }),
);

authRouter.get(
  '/github/callback',
  passport.authenticate('github', {
    session: false,
    failureRedirect: '/api/auth/failed',
  }),
  AuthController.githubCallback,
);

authRouter.post('/refresh', AuthController.refresh);

authRouter.post('/logout', AuthController.logout);

authRouter.get('/me', requireAuth, AuthController.me);

authRouter.get('/failed', () => {
  throw new UnauthorizedError('Github authentication failed');
});

export default authRouter;
