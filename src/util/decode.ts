import jwt, { Secret } from "jsonwebtoken";
import type { NextApiRequest } from "next";

export function getAccountFromToken(req: NextApiRequest): string | undefined {
  const token = req.headers.authorization?.split(" ")[1];
  const secretKey = process.env.JWT_SECRET_KEY;

  let accountFromToken: string | undefined;

  if (token && secretKey) {
    try {
      const decoded = jwt.verify(token, secretKey as Secret);

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
