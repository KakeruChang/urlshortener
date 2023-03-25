import jwt, { Secret } from "jsonwebtoken";
import type { NextApiRequest } from "next";
import { createClient } from "redis";

const secretKey = process.env.JWT_SECRET_KEY as Secret | undefined;

export const getToken = (req: NextApiRequest) =>
  req.headers.authorization?.split(" ")[1];

const TOKEN_BLACKLIST_KEY = "token_blacklist";

class TokenManager {
  client = createClient({ url: process.env.REDIS_URL });

  async connect() {
    try {
      this.client.on("error", (err) => console.warn("Redis Client Error", err));
      await this.client.connect();
    } catch (error) {
      console.warn("Fail to connect to Redis", error);
    }
  }

  async revoke(req: NextApiRequest) {
    const token = getToken(req);

    if (token) {
      try {
        await this.connect();
        await this.client.sAdd(TOKEN_BLACKLIST_KEY, token);
        console.log(`Token ${token} has been revoked.`);
      } catch (error) {
        console.warn(`Failed to revoke Token ${token}.`);
      }
    }
  }

  async checkTokenRevoked(token: string | undefined) {
    if (token) {
      try {
        await this.connect();
        return await this.client.sIsMember(TOKEN_BLACKLIST_KEY, token);
      } catch (error) {
        console.warn("checkTokenRevoked:", error);
      }
    }
    return true;
  }

  async getAccountFromToken(req: NextApiRequest): Promise<string | undefined> {
    const token = getToken(req);

    let isTokenRevoked = false;
    try {
      isTokenRevoked = await this.checkTokenRevoked(token);
    } catch (error) {
      console.warn(error);
      return;
    }

    let accountFromToken: string | undefined;

    if (token && !isTokenRevoked && secretKey) {
      try {
        const decoded = jwt.verify(token, secretKey);

        if (
          decoded &&
          typeof decoded === "object" &&
          "account" in decoded &&
          typeof decoded.account === "string"
        ) {
          accountFromToken = decoded.account;
        }
      } catch (err) {
        console.warn("decoded fail", err);
      }
    }
    return accountFromToken;
  }
}

const tokenManager = new TokenManager();
export default tokenManager;
