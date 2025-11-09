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

const CNBCTransformer: TransformerType = async (url: string) => {
  const parser = new Parser();
  const feed = await parser.parseURL(url);
  const items: RawPost[] = [];

  for (const item of feed.items) {
    const title = item.title?.trim();
    const link = item.link?.trim();
    const description = (item.contentSnippet ?? item.content)?.trim();

    // Ignore posts without title + description, or without link
    if (!title || !description) continue;
    if (!link) continue;

    const categories = (item.categories ?? []).map((cat) => cat["_"]); // TODO: Use categories?

    items.push({
      source: "CNBC",
      title,
      link,
      description,
      image: null,
      imageDescription: null,
      categories: categories.length > 0 ? categories : null,
      datePublished: item.pubDate ? new Date(item.pubDate) : undefined,
    });
  }

  return items;
};

const GuardianTransformer: TransformerType = async (url: string) => {
  const parser = new Parser({
    customFields: {
      item: ["media:content"],
    },
  });
  const feed = await parser.parseURL(url);
  const items: RawPost[] = [];

  for (const item of feed.items) {
    const title = item.title?.trim();
    const link = item.link?.trim();
    const description = item.contentSnippet?.trim(); // Prefer snippet to avoid HTML

    // Ignore posts without title + description, or without link
    if (!title || !description) continue;
    if (!link) continue;

    const categories = (item.categories ?? []).map((cat) => cat["_"]); // TODO: Use categories?
    const image = item["media:content"] ? item["media:content"].$.url : null;

    items.push({
      source: "The Guardian",
      title,
      link,
      description,
      image,
      categories: categories.length > 0 ? categories : null,
      imageDescription: null,
      datePublished: item.pubDate ? new Date(item.pubDate) : undefined,
    });
  }

  return items;
};

const BBCTransformer: TransformerType = async (url: string) => {
  const parser = new Parser({
    customFields: {
      item: ["media:thumbnail"],
    },
  });
  const feed = await parser.parseURL(url);
  const items: RawPost[] = [];

  for (const item of feed.items) {
    const title = item.title?.trim();
    const link = item.link?.trim();
    const description = (item.contentSnippet ?? item.content)?.trim();

    // Ignore posts without title + description, or without link
    if (!title || !description) continue;
    if (!link) continue;

    const categories = (item.categories ?? []).map((cat) => cat["_"]); // TODO: Use categories?
    const image = item["media:thumbnail"]
      ? item["media:thumbnail"].$.url
      : null;

    items.push({
      source: "BBC",
      title,
      link,
      description,
      image,
      imageDescription: null,
      categories: categories.length > 0 ? categories : null,
      datePublished: item.pubDate ? new Date(item.pubDate) : undefined,
    });
  }

  return items;
};

const NPRTransformer: TransformerType = async (url: string) => {
  const parser = new Parser();
  const feed = await parser.parseURL(url);
  const items: RawPost[] = [];

  for (const item of feed.items) {
    const title = item.title?.trim();
    const link = item.link?.trim();
    const description = (item.contentSnippet ?? item.content)?.trim();

    // Ignore posts without title + description, or without link
    if (!title || !description) continue;
    if (!link) continue;

    const categories = (item.categories ?? []).map((cat) => cat["_"]); // TODO: Use categories?

    items.push({
      source: "NPR",
      title,
      link,
      description,
      image: null,
      imageDescription: null,
      categories: categories.length > 0 ? categories : null,
      datePublished: item.pubDate ? new Date(item.pubDate) : undefined,
    });
  }

  return items;
};

const WiredTransformer: TransformerType = async (url: string) => {
  const parser = new Parser({
    customFields: {
      item: ["media:thumbnail"],
    },
  });
  const feed = await parser.parseURL(url);
  const items: RawPost[] = [];

  for (const item of feed.items) {
    const title = item.title?.trim();
    const link = item.link?.trim();
    const description = (item.contentSnippet ?? item.content)?.trim();

    // Ignore posts without title + description, or without link
    if (!title || !description) continue;
    if (!link) continue;

    const categories = (item.categories ?? []).map((cat) => cat["_"]); // TODO: Use categories?
    const image = item["media:thumbnail"]
      ? item["media:thumbnail"].$.url
      : null;

    items.push({
      source: "Wired",
      title,
      link,
      description,
      image,
      imageDescription: null,
      categories: categories.length > 0 ? categories : null,
      datePublished: item.pubDate ? new Date(item.pubDate) : undefined,
    });
  }

  return items;
};

const HackerNewsTransformer: TransformerType = async (url: string) => {
  const parser = new Parser();
  const feed = await parser.parseURL(url);
  const items: RawPost[] = [];

  for (const item of feed.items) {
    const title = item.title?.trim();
    const link = item.link?.trim();
    const description = (item.contentSnippet ?? item.content)?.trim();

    // Ignore posts without title + description, or without link
    if (!title || !description) continue;
    if (!link) continue;

    const categories = (item.categories ?? []).map((cat) => cat["_"]); // TODO: Use categories?

    items.push({
      source: "Hacker News",
      title,
      link,
      description,
      image: null,
      imageDescription: null,
      categories: categories.length > 0 ? categories : null,
      datePublished: item.pubDate ? new Date(item.pubDate) : undefined,
    });
  }

  return items;
};

const VergeTransformer: TransformerType = async (url: string) => {
  const parser = new Parser({
    customFields: {
      item: ["summary"],
    },
  });
  const feed = await parser.parseURL(url);
  const items: RawPost[] = [];

  for (const item of feed.items) {
    const title = item.title?.trim();
    const link = item.link?.trim();
    const description = (item.summary ?? item.content)?.trim();

    // Ignore posts without title + description, or without link
    if (!title || !description) continue;
    if (!link) continue;

    const categories = (item.categories ?? []).map((cat) => cat["_"]); // TODO: Use categories?

    items.push({
      source: "The Verge",
      title,
      link,
      description,
      image: null,
      imageDescription: null,
      categories: categories.length > 0 ? categories : null,
      datePublished: item.pubDate ? new Date(item.pubDate) : undefined,
    });
  }

  return items;
};

export const Transformers = {
  NYTimes: NYTimesTransformer,
  CNBC: CNBCTransformer,
  Guardian: GuardianTransformer,
  BBC: BBCTransformer,
  NPR: NPRTransformer,
  Wired: WiredTransformer,
  Verge: VergeTransformer,
  HackerNews: HackerNewsTransformer,
} as const;
