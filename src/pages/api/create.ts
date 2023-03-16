// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { User } from "@component/model/User";
import { getShortUrl } from "@component/util/hash";
import type { NextApiRequest, NextApiResponse } from "next";
import sequelize, { UrlSequelize } from "../../server/db";

type Data = {
  shortUrl: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | { message: string }>
) {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  if (req.method === "POST") {
    const { url } = req.body as {
      user?: User;
      url: string;
    };

    const result = await UrlSequelize.findAll({
      where: {
        originUrl: url,
      },
    });
    if (result.length > 0) {
      res.status(200).json({ shortUrl: result[0].shortUrl });
    } else {
      const shortUrl = getShortUrl(url);

      try {
        await UrlSequelize.create({
          originUrl: url,
          shortUrl,
          times: 0,
        });

        res.status(200).json({ shortUrl });
      } catch (error) {
        console.warn(error);
        res.status(400).json({ message: "There may be some wrong" });
      }
    }
  } else {
    res.status(400).json({ message: "Invalid request method" });
  }
}
