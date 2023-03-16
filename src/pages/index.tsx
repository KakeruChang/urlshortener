import Head from "next/head";
import Link from "next/link";
import { Inter } from "next/font/google";
import { useCallback, useEffect, useRef, useState } from "react";
import { checkURLIsValid } from "@component/util/url";
import Tooltip, { TooltipHandle } from "@component/components/Tooltip";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [url, setUrl] = useState("https://www.google.com.tw/");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  const tooltipRef = useRef<TooltipHandle>(null);

  const onClickHandler = useCallback(async () => {
    setError("");

    const isValid = await checkURLIsValid(url);
    if (isValid) {
      const response = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      setShortUrl(data.shortUrl);
    } else {
      setError("This is not a valid url");
      setShortUrl("");
    }
  }, [url]);

  useEffect(() => {
    if (shortUrl) {
      navigator.clipboard.writeText(location.href + shortUrl);
      tooltipRef.current?.show();
    }
  }, [shortUrl]);

  return (
    <>
      <Head>
        <title>URL Shortener</title>
        <meta name="description" content="URL Shortener" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
            <p>Your short url:</p>
          </div>
          {shortUrl ? (
            <div className="flex items-center">
              <Link href={shortUrl} className="link link-primary">
                {location.href + shortUrl}
              </Link>
              <Tooltip content="copied" ref={tooltipRef}>
                <div />
              </Tooltip>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}
