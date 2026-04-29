import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { authService } from './auth';

/**
 * JWT Guard Middleware - Protects routes by verifying Bearer token
 * Extracts user data from JWT and stores in context
 */
export const jwtGuard = () => async (c: Context, next: () => Promise<void>) => {
  // Allow OPTIONS requests for CORS preflight
  if (c.req.method === 'OPTIONS') {
    return await next();
  }

  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = await authService.verifyAccessToken(token);
    c.set('user', decoded);
  } catch (error) {
    throw new HTTPException(401, { message: 'Invalid or expired token' });
  }

  await next();
};

/**
 * Type helper for getting user from context
 */
export interface AuthContext {
  user: {
    userId: number;
    email: string;
    role: string;
    agenceId?: number;
    societeId?: number;
  };
}

export const getUser = (c: Context) => c.get('user') as AuthContext['user'];
