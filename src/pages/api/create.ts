// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ResponseContent } from "@component/model/Common";
import { getShortUrl } from "@component/util/hash";
import jwt, { Secret } from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import ogs from "open-graph-scraper";
import sequelize, {
  UrlSequelize,
  URLTableContent,
  UserSequelize,
  UserTableContent,
  OpenGraphMetadataSequelize,
  OpenGraphMetadataTableContent,
} from "../../server/db";

interface CreateShortUrlResponseContent extends ResponseContent {
  short_url?: string;
  title?: string;
  description?: string;
  image?: string;
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

    let user: UserTableContent | null = null;

    if (accountFromToken) {
      user = await UserSequelize.findOne({
        where: {
          account: accountFromToken,
        },
      });
    }

    let urlResult: URLTableContent | null = null;

    if (user?.dataValues.id) {
      urlResult = await UrlSequelize.findOne({
        where: {
          originUrl: url,
          UserId: user?.dataValues.id,
        },
      });
    } else {
      urlResult = await UrlSequelize.findOne({
        where: {
          originUrl: url,
        },
      });
    }

    if (urlResult) {
      res.status(200).json({ short_url: urlResult.dataValues.shortUrl });
    } else {
      // memo short url
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

        const urlResult = await UrlSequelize.create(urlContent);

        let ogResult: OpenGraphMetadataTableContent | null = null;
        // get ogData
        try {
          const { result: ogData } = await ogs({ url });
          const image = ogData.ogImage;
          ogResult = await OpenGraphMetadataSequelize.create({
            title: ogData.ogTitle ?? "",
            description: ogData.ogDescription ?? "",
            image:
              typeof image === "string"
                ? image
                : Array.isArray(image)
                ? image[0].url
                : image?.url ?? "",
            isOrigin: true,
            UrlId: urlResult.dataValues.id,
          });
        } catch (error) {
          console.log({ error });
        }

        res.status(200).json({
          short_url: shortUrl,
          title: ogResult?.dataValues.title,
          description: ogResult?.dataValues.description,
          image: ogResult?.dataValues.image,
        });
      } catch (error) {
        console.warn(error);
        res.status(400).json({ message: "There may be some wrong" });
      }
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
