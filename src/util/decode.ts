import jwt, { Secret } from "jsonwebtoken";
import type { NextApiRequest } from "next";
import { createClient } from "redis";

const secretKey = process.env.JWT_SECRET_KEY as Secret | undefined;

export const getToken = (req: NextApiRequest) =>
  req.headers.authorization?.split(" ")[1];

export async function getAccountFromToken(
  req: NextApiRequest,
  client: ReturnType<typeof createClient>
): Promise<string | undefined> {
  const token = getToken(req);

  let isTokenRevoked = false;
  try {
    isTokenRevoked = await checkIsJWTRevoked(token, client);
  } catch (error) {
    console.warn(error);
    return;
  } finally {
    client.disconnect();
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

const TOKEN_BLACKLIST_KEY = "token_blacklist";
export const client = createClient({ url: process.env.REDIS_URL });

export async function connectToRedis(client: ReturnType<typeof createClient>) {
  try {
    client.on("error", (err) => console.warn("Redis Client Error", err));
    await client.connect();
  } catch (error) {
    console.warn("Fail to connect to Redis", error);
  }
}

export async function revokeJWT(
  req: NextApiRequest,
  client: ReturnType<typeof createClient>
): Promise<void> {
  const token = getToken(req);

  if (token) {
    try {
      await client.sAdd(TOKEN_BLACKLIST_KEY, token);
      console.log(`Token ${token} has been revoked.`);
    } catch (error) {
      console.warn(`Failed to revoke Token ${token}.`);
    }
  }
}

export async function checkIsJWTRevoked(
  token: string | undefined,
  client: ReturnType<typeof createClient>
) {
  if (token) {
    return await client.sIsMember(TOKEN_BLACKLIST_KEY, token);
  }
  return true;
}
