import Parser from "rss-parser";
import { RawPost } from "./ingest";

/**
 * A transformer takes a URL to an RSS feed (from a specifc source) and
 * converts it into an array of RawPosts.
 */

export type TransformerType = (url: string) => Promise<RawPost[]>;

const NYTimesTransformer: TransformerType = async (url: string) => {
  const parser = new Parser({
    customFields: {
      item: ["description", "media:content", "media:description"],
    },
  });
  const feed = await parser.parseURL(url);

  const items: RawPost[] = [];

  for (const item of feed.items) {
    const categories = (item.categories ?? []).map((cat) => cat["_"]); // TODO: Use categories?
    const description = item.description ?? "";
    const image = item["media:content"] ? item["media:content"].$.url : null;
    const datePublished = item.pubDate ? new Date(item.pubDate) : null;

    if (!item.title) continue;
    if (!item.link) continue;

    items.push({
      source: "NYTimes",
      title: item.title,
      link: item.link,
      description,
      imageDescription: item["media:description"] ?? null,
      categories: categories.length > 0 ? categories : null,
      image,
      datePublished: datePublished ?? undefined,
    });
  }

  return items;
};

// const CNBCTransformer: TransformerType = async (url: string) => {
//   const parser = new Parser();
//   const feed = await parser.parseURL(url);

//   return feed.items.map((item) => {
//     return {
//       source: "CNBC",

//       title: item.title ?? "Untitled",
//       link: item.link ?? null,
//       description: item.content ?? null,
//       image: null,
//     };
//   });
// };

// const GuardianTransformer: TransformerType = async (url: string) => {
//   const parser = new Parser({
//     customFields: {
//       item: ["media:content"],
//     },
//   });
//   const feed = await parser.parseURL(url);

//   return feed.items.map((item) => {
//     const categories = item.categories.map((cat) => cat["_"]); // TODO: Use categories?
//     const image = item["media:content"] ? item["media:content"].$.url : null;

//     return {
//       source: "The Guardian",

//       title: item.title ?? "Untitled",
//       link: item.link ?? null,
//       description: item.contentSnippet ?? null, // Normal `content` includes HTML
//       image,
//     };
//   });
// };

// const BBCTransformer: TransformerType = async (url: string) => {
//   const parser = new Parser({
//     customFields: {
//       item: ["media:thumbnail"],
//     },
//   });
//   const feed = await parser.parseURL(url);

//   return feed.items.map((item) => {
//     const image = item["media:thumbnail"]
//       ? item["media:thumbnail"].$.url
//       : null;

//     return {
//       source: "BBC",

//       title: item.title ?? "Untitled",
//       link: item.link ?? null,
//       description: item.content ?? null,
//       image,
//     };
//   });
// };

// const NPRTransformer: TransformerType = async (url: string) => {
//   const parser = new Parser();
//   const feed = await parser.parseURL(url);

//   return feed.items.map((item) => {
//     return {
//       source: "NPR",

//       title: item.title ?? "Untitled",
//       link: item.link ?? null,
//       description: item.content ?? null,
//       image: null,
//     };
//   });
// };

// const WiredTransformer: TransformerType = async (url: string) => {
//   const parser = new Parser({
//     customFields: {
//       item: ["media:thumbnail"],
//     },
//   });
//   const feed = await parser.parseURL(url);

//   return feed.items.map((item) => {
//     const image = item["media:thumbnail"]
//       ? item["media:thumbnail"].$.url
//       : null;
//     return {
//       source: "Wired",

//       title: item.title ?? "Untitled",
//       link: item.link ?? null,
//       description: item.content ?? null,
//       image,
//     };
//   });
// };

// const VergeTransformer: TransformerType = async (url: string) => {
//   const parser = new Parser({
//     customFields: {
//       item: ["summary"],
//     },
//   });
//   const feed = await parser.parseURL(url);

//   return feed.items.map((item) => {
//     return {
//       source: "The Verge",

//       title: item.title ?? "Untitled",
//       link: item.link ?? null,
//       description: item.summary ?? null, // TODO: Handle special chars: —&#160;asking the same question. And I’m afraid I’m going to keep being here, week in, week out, until I have a T1 Phone in [&#8230;]"
//       image: null,
//     };
//   });
// };

// const HackerNewsTransformer: TransformerType = async (url: string) => {
//   const parser = new Parser();
//   const feed = await parser.parseURL(url);

//   return feed.items.map((item) => {
//     return {
//       source: "Hacker News",

//       title: item.title ?? "Untitled",
//       link: item.link ?? null,
//       description: item.content ?? null,
//       image: null,
//     };
//   });
// };

export const Transformers = {
  NYTimes: NYTimesTransformer,
  // CNBC: CNBCTransformer,
  // Guardian: GuardianTransformer,
  // BBC: BBCTransformer,
  // NPR: NPRTransformer,
  // Wired: WiredTransformer,
  // Verge: VergeTransformer,
  //   HackerNews: HackerNewsTransformer,
} as const;
