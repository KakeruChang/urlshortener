export interface OpenGraphMetadata {
  title: string;
  description: string;
  img: string; // the url of string
}

export interface URLContent {
  originUrl: string; // original url
  shortUrl: string; // new url
  times: number;
}
