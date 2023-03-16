import { ResponseContent } from "@component/model/Common";
import { getShortUrl } from "@component/util/hash";
import type { NextApiRequest, NextApiResponse } from "next";
import sequelize, { UrlSequelize } from "../../server/db";

interface CheckUrlResponseContent extends ResponseContent {
  isValid?: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckUrlResponseContent>
) {
  if (req.method === "POST") {
    const { url } = req.body as {
      url: string;
    };

    if (url) {
      try {
        const response = await fetch(url);
        res.status(200).json({ isValid: response.status === 200 });
      } catch (error) {
        console.warn(error);
        res.status(400).json({ isValid: false });
      }
    } else {
      res.status(400).json({ message: "Invalid request method" });
    }
  }
}
