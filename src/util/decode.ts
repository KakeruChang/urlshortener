import jwt, { Secret } from "jsonwebtoken";
import type { NextApiRequest } from "next";

const secretKey = process.env.JWT_SECRET_KEY as Secret | undefined;

export function getAccountFromToken(req: NextApiRequest): string | undefined {
  const token = req.headers.authorization?.split(" ")[1];

  let accountFromToken: string | undefined;

  if (token && secretKey) {
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

export function revokeJWT(req: NextApiRequest): string {
  const account = getAccountFromToken(req);

  if (account && secretKey) {
    return jwt.sign({ account }, secretKey, { expiresIn: 0 });
  }
  return "";
}
