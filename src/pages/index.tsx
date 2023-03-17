import axios from "@component/axios";
import Tooltip from "@component/components/Tooltip";
import { selectUserName } from "@component/reducer/User";
import { checkURLIsValid } from "@component/util/url";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const userName = useSelector(selectUserName);
  const [url, setUrl] = useState("https://www.google.com.tw/");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [tooltipIsShow, setTooltipIsShow] = useState(false);

  const onClickHandler = useCallback(async () => {
    setError("");

    const isValid = await checkURLIsValid(url);
    if (isValid) {
      const response = await axios.post<{ short_url: string }>("/create", {
        url,
      });
      setShortUrl(response.data.short_url);
    } else {
      setError("This is not a valid url");
      setShortUrl("");
    }
  }, [url]);

  useEffect(() => {
    if (shortUrl) {
      navigator.clipboard.writeText(location.href + shortUrl);
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

  return (
    <>
      <Head>
        <title>URL Shortener</title>
        <meta name="description" content="URL Shortener" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="px-24">
        <Link href="/login" as="/login" className="link link-primary">
          Login
        </Link>
        {userName ? `( ${userName} )` : null}
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
            <p>Your short url:</p>
          </div>
          {shortUrl ? (
            <div className="flex items-center">
              <Link href={shortUrl} as={shortUrl} className="link link-primary">
                {location.href + shortUrl}
              </Link>
              <Tooltip content="copied" isShow={tooltipIsShow}>
                <div />
              </Tooltip>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}
