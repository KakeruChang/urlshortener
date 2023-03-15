interface OpenGraphMetadata {
  title: string;
  description: string;
  img: string; // the url of string
}

export interface URLContent {
  originURL: string; // original url
  shortenURL: string; // new url
  times: number;
  userID?: string; // equal to the id of user
  originOGM?: OpenGraphMetadata;
  customOGM?: OpenGraphMetadata;
}
