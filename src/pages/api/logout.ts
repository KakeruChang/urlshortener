import { ResponseContent } from "@/model/Common";
import { revokeJWT, client, connectToRedis } from "@/util/decode";
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

  try {
    await connectToRedis(client);
    await revokeJWT(req, client);
    res.status(204);
  } catch (error) {
    res.status(400).json({ message: "Log out failed!" });
  }
}
