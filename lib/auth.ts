import { hash, compare } from "bcryptjs";
import { sign, verify } from "@elysiajs/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-change-in-prod";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-super-secret-refresh-key-change-in-prod";

/**
 * AUTH SERVICE - Password hashing and JWT token management
 */

export const authService = {
  /**
   * Hash a password using bcryptjs
   */
  async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  },

  /**
   * Compare password with hash
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  },

  /**
   * Generate JWT access token (24 hours)
   */
  async generateAccessToken(payload: {
    userId: number;
    email: string;
    role: string;
    agenceId?: number;
    societeId?: number;
  }): Promise<string> {
    const token = await sign(
      {
        ...payload,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
      },
      JWT_SECRET
    );
    return token;
  },

  /**
   * Generate JWT refresh token (7 days)
   */
  async generateRefreshToken(userId: number): Promise<string> {
    const token = await sign(
      {
        userId,
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
      },
      JWT_REFRESH_SECRET
    );
    return token;
  },

  /**
   * Verify JWT access token
   */
  async verifyAccessToken(token: string): Promise<any> {
    try {
      const decoded = await verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  },

  /**
   * Verify JWT refresh token
   */
  async verifyRefreshToken(token: string): Promise<any> {
    try {
      const decoded = await verify(token, JWT_REFRESH_SECRET);
      return decoded;
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  },
};
