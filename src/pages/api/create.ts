// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ResponseContent } from "@/model/Common";
import { OGContent } from "@/model/Url";
import sequelize from "@/server/db";
import { createShortUrl, findOgData, findUrl, findUser } from "@/server/method";
import TokenManager from "@/util/token";
import type { NextApiRequest, NextApiResponse } from "next";

interface CreateShortUrlResponseContent extends ResponseContent, OGContent {
  short_url?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateShortUrlResponseContent>
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Invalid request method" });
    }

    const { url } = req.body as {
      url: string;
    };

    const accountFromToken = await TokenManager.getAccountFromToken(req);

    await sequelize.authenticate();

    const user = await findUser(accountFromToken);
    const urlResult = await findUrl(url, user?.dataValues.id);

    if (urlResult) {
      const ogData = await findOgData(
        urlResult.dataValues.id,
        urlResult.dataValues.shortUrl
      );
      res.status(200).json(ogData);
    } else {
      const newShortUrl = await createShortUrl(url, user?.dataValues.id);

      if (newShortUrl) {
        res.status(200).json(newShortUrl);
      } else {
        res
          .status(400)
          .json({ message: "There is wrong as creating short url" });
      }
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
