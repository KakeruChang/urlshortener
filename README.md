## URL Shortener

This is a simple URL shortener service that generates a short URL for any long URL. The generated URL can then be used to redirect users to the original long URL.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

After entering a URL directly into the input and clicking the send button, a short URL will be generated and displayed below. The generated URL will also be automatically copied to the user's clipboard. If the URL entered is invalid, an error message will be displayed, and no URL conversion will be performed.

- Validating URL.
- Automatically copying shortened URL to clipboard.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
