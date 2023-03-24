import { ResponseContent } from "@/model/Common";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

interface CheckUrlResponseContent extends ResponseContent {
  is_valid?: boolean;
}

const fakeUserAgent =
  "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.81 Safari/537.36";

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
      const response = await axios.get(url);
      return res.status(200).json({ is_valid: response.status === 200 });
    } catch (error) {
      console.warn(error);
    }

    try {
      const response = await axios.get(url, {
        headers: { "User-Agent": fakeUserAgent },
      });
      res.status(200).json({ is_valid: response.status === 200 });
    } catch (error) {
      console.warn("With fake user agent:", error);
      res.status(200).json({ is_valid: false });
    }
  } else {
    res.status(200).json({ is_valid: false });
  }
}
