// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ResponseContent } from "@component/model/Common";
import { getShortUrl } from "@component/util/hash";
import type { NextApiRequest, NextApiResponse } from "next";
import sequelize, { UrlSequelize } from "../../server/db";

interface CreateShortUrlResponseContent extends ResponseContent {
  shortUrl?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateShortUrlResponseContent>
) {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    if (req.method !== "POST") {
      return res.status(405).json({ message: "Invalid request method" });
    }

    const { url } = req.body as {
      url: string;
    };

    const result = await UrlSequelize.findOne({
      where: {
        originUrl: url,
      },
    });
    console.log({ result });

    if (result) {
      res.status(200).json({ shortUrl: result.dataValues.shortUrl });
    } else {
      const shortUrl = getShortUrl(url);

      try {
        await UrlSequelize.create({
          shortUrl,
          originUrl: url,
          times: 0,
        });

        res.status(200).json({ shortUrl });
      } catch (error) {
        console.warn(error);
        res.status(400).json({ message: "There may be some wrong" });
      }
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
