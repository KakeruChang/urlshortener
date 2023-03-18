import { ResponseContent } from "@component/model/Common";
import sequelize from "@component/server/db";
import {
  getUrlWithOgByAccount,
  URLJoinObContent,
} from "@component/server/method";
import { getAccountFromToken } from "@component/util/decode";
import { NextApiRequest, NextApiResponse } from "next";

interface MemberResponseContent extends ResponseContent {
  urls: URLJoinObContent[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MemberResponseContent>
) {
  try {
    await sequelize.authenticate();

    const accountFromToken = getAccountFromToken(req);

    if (accountFromToken) {
      if (req.method === "GET") {
        const urls = await getUrlWithOgByAccount(accountFromToken);

        return res.status(200).json({ urls });
      } else if (req.method === "PUT") {
        // update og data
      }
      return res
        .status(405)
        .json({ message: "Invalid request method", urls: [] });
    }
    return res.status(401).json({ message: "Invalid credentials", urls: [] });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
