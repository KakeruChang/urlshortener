import { ResponseContent } from "@/model/Common";
import { revokeJWT } from "@/util/decode";
import { NextApiRequest, NextApiResponse } from "next";

interface LogoutResponseContent extends ResponseContent {
  token?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LogoutResponseContent>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Invalid request method" });
  }
  const expiredToken = revokeJWT(req);
  return res.status(200).json({ token: expiredToken });
}
