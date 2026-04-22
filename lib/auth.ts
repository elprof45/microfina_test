import { hash, compare } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-key-change-in-prod";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ||
  "your-super-secret-refresh-key-change-in-prod";

const accessSecret = new TextEncoder().encode(JWT_SECRET);
const refreshSecret = new TextEncoder().encode(JWT_REFRESH_SECRET);

/**
 * AUTH SERVICE - Password hashing and JWT token management
 */
export const authService = {
  async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  },

  async comparePassword(password: string, passwordHash: string): Promise<boolean> {
    return compare(password, passwordHash);
  },

  async generateAccessToken(payload: {
    userId: number;
    email: string;
    role: string;
    agenceId?: number;
    societeId?: number;
  }): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(accessSecret);
  },

  async generateRefreshToken(userId: number): Promise<string> {
    return new SignJWT({ userId })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(refreshSecret);
  },

  async verifyAccessToken(token: string): Promise<any> {
    try {
      const { payload } = await jwtVerify(token, accessSecret);
      return payload;
    } catch {
      throw new Error("Invalid or expired token");
    }
  },

  async verifyRefreshToken(token: string): Promise<any> {
    try {
      const { payload } = await jwtVerify(token, refreshSecret);
      return payload;
    } catch {
      throw new Error("Invalid or expired refresh token");
    }
  },
};