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
