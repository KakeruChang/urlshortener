import crypto from "crypto";

const generateSalt = () => {
  return crypto.randomBytes(16).toString("hex");
};

const base62Alphabet =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const getShortUrl = (url: string) => {
  const hash = crypto.createHmac("sha512", generateSalt());
  hash.update(url);
  const hashedUrl = hash.digest("hex");

  let decimal = parseInt(hashedUrl, 16);
  let base62 = "";
  while (decimal > 0) {
    let remainder = decimal % 62;
    decimal = Math.floor(decimal / 62);
    base62 = base62Alphabet[remainder] + base62;
  }
  return base62.substring(0, 8);
};
