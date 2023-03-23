## URL Shortener

This is a simple URL shortener service that generates a short URL for any long URL. The generated URL can then be used to redirect users to the original long URL.

## Getting Started

First, install all packages:

```bash
yarn install
```

Second, apply changes of package:

```bash
yarn patch-package
```

Set environment variables
`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`, `JWT_SECRET_KEY`,

Last, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

After entering a URL directly into the input and clicking the send button, a short URL will be generated and displayed below. The generated URL will also be automatically copied to the user's clipboard. If the URL entered is invalid, an error message will be displayed, and no URL conversion will be performed.You can also go to the member page to delete short URLs or edit the Open Graph Metadata information for the short URLs.

- Validating URL.
- Automatically copying shortened URL to clipboard.
- Sign up and log in.
- Displaying Open Graph Metadata for the original URL.
- Displaying Preview Information when generating short URL.
- Delete short URL.
- Edit Open Graph Metadata for the short URL.
- Add Redis to prevent frequent database queries when redirecting.
- Display number of uses.

## Run

[You can try using this service at this link.](https://url-shortener-6owq.onrender.com/)
