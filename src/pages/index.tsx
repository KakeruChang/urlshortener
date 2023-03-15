import Head from "next/head";
import { Inter } from "next/font/google";
import { useState } from "react";
import { checkURLIsValid } from "@component/util/url";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [url, setUrl] = useState("https://www.google.com.tw/");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

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
          <button
            className="btn btn-success ml-5"
            onClick={async () => {
              setError("");
              const isValid = await checkURLIsValid(url);
              if (isValid) {
                const response = await fetch("/api/createUrl", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ url }),
                });
                const data = await response.json();
                console.log({ data });
              } else {
                setError("This is not a valid url");
              }
            }}
          >
            Send
          </button>
        </div>
        {error ? <p className="text-error">{error}</p> : null}
        {shortUrl ? (
          <div className="mt-12">
            <a className="link link-primary">{shortUrl}</a>
          </div>
        ) : null}
      </main>
    </>
  );
}
