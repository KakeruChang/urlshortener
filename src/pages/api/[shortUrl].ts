import { ResponseContent } from "@component/model/Common";
import type { NextApiRequest, NextApiResponse } from "next";
import sequelize, { UrlSequelize } from "../../server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseContent>
) {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    if (req.method === "GET") {
      const { shortUrl } = req.query;

      if (shortUrl) {
        const result = await UrlSequelize.findOne({
          where: {
            shortUrl,
          },
        });
        if (!result) {
          res.redirect(303, "/");
          return;
        }
        res.redirect(303, result.originUrl);
      } else {
        res.status(400).json({ message: "Nothing happen" });
      }

      // }
    } else {
      res.status(400).json({ message: "Invalid request method" });
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
