import { Transformers, TransformerType } from "./transformers";

export interface FeedWithTransformer {
  slug: string;
  name: string;
  url: string;
  transformer: TransformerType;
}

export const FEEDS: FeedWithTransformer[] = [
  {
    slug: "nytimes-home-page",
    name: "NYTimes - Home Page",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
    transformer: Transformers.NYTimes,
  },
  {
    slug: "nytimes-world",
    name: "NYTimes - World",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    transformer: Transformers.NYTimes,
  },
  /* New York Times */
  // [
  //   "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
  //   Transformers.NYTimes,
  // ],
  // [
  //   "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
  //   Transformers.NYTimes,
  // ],
  // ["https://rss.nytimes.com/services/xml/rss/nyt/US.xml", Transformers.NYTimes],
  // [
  //   "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml",
  //   Transformers.NYTimes,
  // ],
  // [
  //   "https://rss.nytimes.com/services/xml/rss/nyt/Upshot.xml",
  //   Transformers.NYTimes,
  // ],
  // /* Other News Outlets */
  // ["https://www.cnbc.com/id/100003114/device/rss/rss.html", Transformers.CNBC],
  // ["https://www.theguardian.com/commentisfree/rss", Transformers.Guardian],
  // ["https://feeds.bbci.co.uk/news/world/rss.xml", Transformers.BBC],
  // ["https://feeds.npr.org/1001/rss.xml", Transformers.NPR],
  // /* Tech */
  // ["https://www.wired.com/feed/rss", Transformers.Wired],
  // ["https://www.theverge.com/rss/index.xml", Transformers.Verge],
  //   ["https://hnrss.org/best"], // This RSS doesnt even have descriptions :(
  //   ["https://css-tricks.com/feed/"],
  //   ["http://feeds.feedburner.com/cantbowlcantthrow"], // Cricket Podcast
  //   ["http://pitchfork.com/rss/news"], // Music
] as const;
