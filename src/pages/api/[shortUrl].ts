import { ResponseContent } from "@component/model/Common";
import sequelize, { UrlSequelize } from "@component/server/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseContent>
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Invalid request method" });
    }

    const { shortUrl } = req.query;

    if (shortUrl && typeof shortUrl === "string") {
      const client = createClient({ url: process.env.REDIS_URL });
      client.on("error", (err) => console.warn("Redis Client Error", err));
      await client.connect();

      const originUrlFromRedis = await client.get(shortUrl);

      if (originUrlFromRedis) {
        return res.redirect(303, originUrlFromRedis);
      }

      await sequelize.authenticate();

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
      await Promise.all([
        result.save(),
        client.set(shortUrl, result.dataValues.originUrl),
      ]);
      res.redirect(303, result.dataValues.originUrl);
    } else {
      res.status(400).json({ message: "Nothing happen" });
    }
  } catch (error) {
    console.error("Redirect short url failed", error);
  }
}
