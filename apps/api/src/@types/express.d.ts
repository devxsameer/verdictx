import 'express';
import { AuthUser } from './auth.ts';

export {};

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      validated?: {
        body?: any;
        params?: any;
        query?: any;
      };
      user?: AuthUser;
      authError?: string;
    }
  }
}
