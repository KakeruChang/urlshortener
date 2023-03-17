import { ResponseContent } from "@component/model/Common";
import type { NextApiRequest, NextApiResponse } from "next";
import sequelize, { UrlSequelize } from "../../server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseContent>
) {
  try {
    await sequelize.authenticate();

    if (req.method !== "GET") {
      return res.status(405).json({ message: "Invalid request method" });
    }

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
      result.setDataValue("times", result.dataValues.times + 1);
      result.save();
      res.redirect(303, result.dataValues.originUrl);
    } else {
      res.status(400).json({ message: "Nothing happen" });
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
