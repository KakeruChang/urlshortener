import { ResponseContent } from "@/model/Common";
import sequelize from "@/server/db";
import {
  getUrlWithOgByAccount,
  updateOgData,
  URLJoinObContent,
} from "@/server/method";
import TokenManager from "@/util/token";
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

    const accountFromToken = await TokenManager.getAccountFromToken(req);

    if (accountFromToken) {
      if (req.method === "GET") {
        const urls = await getUrlWithOgByAccount(accountFromToken);

        return res.status(200).json({ urls });
      } else if (req.method === "PUT") {
        const { shortUrl, title, description, image } = req.body;
        const urls = await updateOgData({
          accountFromToken,
          shortUrl,
          title,
          description,
          image,
        });

        return res.status(200).json({ urls });
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
