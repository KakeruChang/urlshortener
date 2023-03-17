// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ResponseContent } from "@component/model/Common";
import { getShortUrl } from "@component/util/hash";
import jwt, { Secret } from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import sequelize, { UrlSequelize, UserSequelize } from "../../server/db";

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

    const token = req.headers.authorization?.split(" ")[1];
    const secretKey = process.env.JWT_SECRET_KEY;

    let accountFromToken = "";

    if (token) {
      try {
        const decoded = jwt.verify(token, secretKey as Secret);

        if (decoded && typeof decoded === "object" && "account" in decoded) {
          accountFromToken = decoded.account;
        }
      } catch (err) {
        console.warn("decoded fail", err);
      }
    }

    const user = await UserSequelize.findOne({
      where: {
        account: accountFromToken,
      },
    });

    const urlResult = await UrlSequelize.findOne({
      where: {
        originUrl: url,
        UserId: user?.dataValues.id,
      },
    });

    if (urlResult) {
      res.status(200).json({ shortUrl: urlResult.dataValues.shortUrl });
    } else {
      const shortUrl = getShortUrl(url);

      try {
        const id = user?.dataValues.id;
        const urlContent: {
          shortUrl: string;
          originUrl: string;
          times: number;
          UserId: number | undefined;
        } = {
          shortUrl,
          originUrl: url,
          times: 0,
          UserId: undefined,
        };
        if (id && Number.isInteger(parseInt(id, 10))) {
          urlContent.UserId = parseInt(id, 10);
        }

        await UrlSequelize.create(urlContent);

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
