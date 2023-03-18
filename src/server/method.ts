import {
  UserSequelize,
  UrlSequelize,
  OpenGraphMetadataSequelize,
  UserTableContent,
} from "./db";

export interface URLJoinObContent {
  shortUrl: string;
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
      title: item.OpenGraphMetadatum?.title,
      description: item.OpenGraphMetadatum?.description,
      image: item.OpenGraphMetadatum?.image,
    }));

  return urls;
}
