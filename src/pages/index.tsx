import axios from "@/axios";
import Navbar from "@/components/Navbar";
import Tooltip from "@/components/Tooltip";
import useValidate from "@/hooks/useValidate";
import { checkURLIsValid, getBasicUrl } from "@/util/url";
import classNames from "classnames";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface ShortUrlOgContent {
  title?: string;
  image?: string;
  description?: string;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [tooltipIsShow, setTooltipIsShow] = useState(false);
  const [ogData, setOgData] = useState<ShortUrlOgContent>({});

  const onClickHandler = useCallback(async () => {
    setError("");

    const isValid = await checkURLIsValid(url);
    if (isValid) {
      const { data } = await axios.post<
        { short_url: string } & ShortUrlOgContent
      >("/create", {
        url,
      });

      setShortUrl(data.short_url);
      setOgData({
        title: data.title,
        description: data.description,
        image: data.image,
      });
    } else {
      setError("This is not a valid url");
      setShortUrl("");
    }
  }, [url]);

  useEffect(() => {
    if (shortUrl) {
      navigator.clipboard.writeText(getBasicUrl() + shortUrl);
      setTooltipIsShow(true);
    }
  }, [shortUrl]);

  useEffect(() => {
    if (tooltipIsShow) {
      setTimeout(() => {
        setTooltipIsShow(false);
      }, 5000);
    }
  }, [tooltipIsShow]);

  useValidate();

  return (
    <>
      <Head>
        <title>URL Shortener</title>
        <meta name="description" content="URL Shortener" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="px-24">
        <div className="flex w-full mt-24">
          <input
            type="text"
            placeholder="Type your url here"
            className="input input-bordered w-full"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
            }}
          />
          <button className="btn btn-success ml-5" onClick={onClickHandler}>
            Send
          </button>
        </div>
        {error ? <p className="text-error">{error}</p> : null}
        <div className="mt-12">
          <div className="flex">
            <p className="font-bold">Your short url:</p>
          </div>
          {shortUrl ? (
            <>
              <div className="flex items-center">
                <Link
                  href={shortUrl}
                  as={shortUrl}
                  className="link link-primary font-bold"
                >
                  {getBasicUrl() + shortUrl}
                </Link>
                <Tooltip content="copied" isShow={tooltipIsShow}>
                  <div />
                </Tooltip>
              </div>
              <div className="card w-96 bg-base-100 shadow-xl mt-12">
                <figure>
                  <div
                    className={classNames(
                      "w-[600px] h-[400px]",
                      "bg-no-repeat bg-contain"
                    )}
                    style={{ backgroundImage: `url(${ogData.image})` }}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{ogData.title}</h2>
                  <p>{ogData.description}</p>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </>
  );
}
