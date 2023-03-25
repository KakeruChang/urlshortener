import { ResponseContent } from "@/model/Common";
import sequelize from "@/server/db";
import {
  getUrlWithOgByAccount,
  updateOgData,
  URLJoinObContent,
} from "@/server/method";
import { getAccountFromToken, client, connectToRedis } from "@/util/decode";
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

    await connectToRedis(client);
    const accountFromToken = await getAccountFromToken(req, client);

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
