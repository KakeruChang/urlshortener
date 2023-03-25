import { ResponseContent } from "@/model/Common";
import TokenManager from "@/util/token";
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
    await TokenManager.revoke(req);
    res.status(204);
  } catch (error) {
    res.status(400).json({ message: "Log out failed!" });
  }
}
