import { ResponseContent } from "@/model/Common";
import type { NextApiRequest, NextApiResponse } from "next";

interface CheckUrlResponseContent extends ResponseContent {
  is_valid?: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckUrlResponseContent>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Invalid request method" });
  }

  const { url } = req.body as {
    url: string;
  };

  if (url) {
    try {
      const response = await fetch(url);
      res.status(200).json({ is_valid: response.status === 200 });
    } catch (error) {
      console.warn(error);
      res.status(200).json({ is_valid: false });
    }
  } else {
    res.status(200).json({ is_valid: false });
  }
}
