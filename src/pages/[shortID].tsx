import { OGContent } from "@component/model/Url";
import sequelize, {
  OpenGraphMetadataSequelize,
  UrlSequelize,
} from "@component/server/db";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ShortUrl({ title, description, image }: OGContent) {
  const router = useRouter();
  const { shortID } = router.query;

  useEffect(() => {
    if (shortID) {
      window.location.href = `/api/${shortID}`;
    }
  }, [shortID]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
      </Head>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { shortID } = context.query;

  const ogData: OGContent = {
    title: undefined,
    description: undefined,
    image: undefined,
  };

  if (shortID) {
    try {
      await sequelize.authenticate();

      const urlResult = await UrlSequelize.findOne({
        where: {
          shortUrl: shortID,
        },
      });
      if (urlResult) {
        const ogResult = await OpenGraphMetadataSequelize.findOne({
          where: { UrlId: urlResult.dataValues.id },
        });
        if (ogResult) {
          ogData.title = ogResult.dataValues.title;
          ogData.description = ogResult.dataValues.description;
          ogData.image = ogResult.dataValues.image;
        }
      }
    } catch (err) {
      console.error("Unable to connect to the database:", err);
    }
  }

  return {
    props: ogData,
  };
};
