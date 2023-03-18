export interface OpenGraphMetadata {
  title: string;
  description: string;
  img: string; // the url of string
}

export interface URLContent {
  originUrl: string; // original url
  shortUrl: string; // new url
  times: number;
  UserId: number;
  id: number;
}

export interface OpenGraphMetadataContent {
  title: string;
  description: string;
  image: string;
  isOrigin: boolean;
  UrlId: number;
}

export interface OGContent {
  title?: string;
  description?: string;
  image?: string;
}
