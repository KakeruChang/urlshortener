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

  if (req.method === "GET") {
    const { shortUrl } = req.query;

    if (shortUrl) {
      const result = await UrlSequelize.findAll({
        where: {
          shortUrl,
        },
      });
      if (result.length === 0) {
        res.redirect(303, "/");
        return;
      }
      res.redirect(303, result[0].originUrl);
    } else {
      res.status(400).json({ message: "Nothing happen" });
    }

    // }
  } else {
    res.status(400).json({ message: "Invalid request method" });
  }
}
