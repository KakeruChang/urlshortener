import { ResponseContent } from "@/model/Common";
import sequelize, { UrlSequelize } from "@/server/db";
import { getUrlWithOgByAccount, URLJoinObContent } from "@/server/method";
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
      if (req.method !== "DELETE") {
        return res
          .status(405)
          .json({ message: "Invalid request method", urls: [] });
      }

      const { shortUrl } = req.query;

      try {
        const urlResult = await UrlSequelize.findOne({ where: { shortUrl } });
        if (urlResult) {
          await urlResult.destroy();

          const urls = await getUrlWithOgByAccount(accountFromToken);
          return res.status(200).json({ urls });
        }
        throw new Error("No Such url");
      } catch (error) {
        console.warn(error);
        return res
          .status(400)
          .json({ message: "There is some error", urls: [] });
      }
    }
    return res.status(401).json({ message: "Invalid credentials", urls: [] });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
