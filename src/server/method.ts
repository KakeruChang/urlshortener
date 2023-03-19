import { getShortUrl } from "@/util/hash";
import ogs from "open-graph-scraper";
import {
  UserSequelize,
  UrlSequelize,
  OpenGraphMetadataSequelize,
  UserTableContent,
} from "./db";

export interface URLJoinObContent {
  shortUrl: string;
  times: number;
  OpenGraphMetadatum?: {
    title?: string;
    description?: string;
    image?: string;
  };
}

export async function getUrlWithOgByAccount(accountFromToken: string) {
  const ogUrlsFromDB = await UserSequelize.findAll({
    where: { account: accountFromToken },
    include: [
      {
        model: UrlSequelize,
        include: [OpenGraphMetadataSequelize],
      },
    ],
  });
  const urls = ogUrlsFromDB
    .flatMap(
      (user) => (user as UserTableContent & { Urls: URLJoinObContent[] }).Urls
    )
    .map((item) => ({
      shortUrl: item.shortUrl,
      times: item.times,
      title: item.OpenGraphMetadatum?.title,
      description: item.OpenGraphMetadatum?.description,
      image: item.OpenGraphMetadatum?.image,
    }));

  return urls;
}

export async function updateOgData({
  accountFromToken,
  shortUrl,
  title,
  description,
  image,
}: {
  accountFromToken: string;
  shortUrl: string;
  title: string;
  description: string;
  image: string;
}) {
  const user = await UserSequelize.findOne({
    where: { account: accountFromToken },
  });
  if (user) {
    const url = await UrlSequelize.findOne({
      where: { shortUrl, UserId: user.dataValues.id },
    });

    if (url) {
      const ogResult = await OpenGraphMetadataSequelize.findOne({
        where: { UrlId: url.dataValues.id },
      });
      if (ogResult) {
        await ogResult.update({
          title,
          description,
          image,
          isOrigin: false,
        });
      } else {
        await OpenGraphMetadataSequelize.create({
          title,
          description,
          image,
          UrlId: url.dataValues.id,
          isOrigin: true,
        });
      }
      const urls = await getUrlWithOgByAccount(accountFromToken);
      return urls;
    }
  }
  return [];
}

export async function findUrl(originUrl: string, userId?: string) {
  let result = null;

  if (userId) {
    result = await UrlSequelize.findOne({
      where: {
        originUrl,
        UserId: userId,
      },
    });
  } else {
    result = await UrlSequelize.findOne({
      where: {
        originUrl,
      },
    });
  }

  return result;
}

export async function getAndCreateOgData(url: string, UrlId: number) {
  let result = null;

  try {
    const { result: ogData } = await ogs({ url });
    const image = ogData.ogImage;
    result = await OpenGraphMetadataSequelize.create({
      title: ogData.ogTitle ?? "",
      description: ogData.ogDescription ?? "",
      image:
        typeof image === "string"
          ? image
          : Array.isArray(image)
          ? image[0].url
          : image?.url ?? "",
      isOrigin: true,
      UrlId,
    });
  } catch (error) {
    console.warn("findOgData error", error);
  }
  return result;
}

interface UrlContent {
  shortUrl: string;
  originUrl: string;
  times: number;
  UserId?: number;
}

export async function createShortUrl(url: string, userId?: string) {
  const shortUrl = getShortUrl(url);

  try {
    const urlContent: UrlContent = {
      shortUrl,
      originUrl: url,
      times: 0,
    };
    if (userId && Number.isInteger(parseInt(userId, 10))) {
      urlContent.UserId = parseInt(userId, 10);
    }

    const urlResult = await UrlSequelize.create(urlContent);
    const ogResult = await getAndCreateOgData(url, urlResult.dataValues.id);

    return {
      short_url: shortUrl,
      title: ogResult?.dataValues.title,
      description: ogResult?.dataValues.description,
      image: ogResult?.dataValues.image,
    };
  } catch (error) {
    console.warn("There is wrong as saving short url", error);
  }
  return undefined;
}

export async function findOgData(UrlId: number, shortUrl: string) {
  try {
    const ogResult = await OpenGraphMetadataSequelize.findOne({
      where: { UrlId },
    });
    if (!ogResult) {
      throw new Error("no such og data");
    }

    return {
      short_url: shortUrl,
      title: ogResult.dataValues.title,
      description: ogResult.dataValues.description,
      image: ogResult.dataValues.image,
    };
  } catch (error) {
    console.warn("findOgData:", error);
    return {
      short_url: shortUrl,
    };
  }
}

export async function findUser(account: string | undefined) {
  let user = null;

  if (account) {
    try {
      user = await UserSequelize.findOne({ where: { account } });
    } catch (error) {
      console.warn("findUser:", error);
    }
  }
  return user;
}
