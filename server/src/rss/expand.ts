import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";
import z from "zod";
import type { RawPost } from "./ingest";

export const EXAMPLE_RAW_NEWS_POST = [
  {
    source: "NYTimes",
    title: "Biden Warns of a 'Very, Very Dark Moment' as He Hits Out at Trump",
    description:
      "The former president, now a far less popular figure in his party, appeared in Nebraska for an overtly political speech that slammed his successor.",
    link: "https://www.nytimes.com/2025/11/07/us/politics/biden-trump-omaha-nebraska.html",
    image:
      "https://static01.nyt.com/images/2025/11/07/multimedia/pol-biden-bclm/pol-biden-bclm-mediumSquareAt3X.jpg",
  },
  {
    source: "NYTimes",
    title:
      "Judge Blocks National Guard From Portland and Says Trump Overstepped His Authority",
    description:
      "Law enforcement officers guarding a federal immigration center in Portland, Ore., during protests last month.",
    link: "https://www.nytimes.com/2025/11/07/us/politics/portland-oregon-national-guard.html",
    image:
      "https://static01.nyt.com/images/2025/11/03/multimedia/00nat-portland-rulingHFO/03trump-blog-portland-wzbh-mediumSquareAt3X.jpg",
  },
  {
    source: "NYTimes",
    title:
      "Trump Approves Pardon for Ex-Officer Convicted in a Chinese Government Plot",
    description:
      "Prosecutors said Michael McMahon had acted as an illegal agent in a conspiracy targeting a Chinese family in New Jersey. The White House says he was tricked into it.",
    link: "https://www.nytimes.com/2025/11/07/us/politics/trump-michael-mcmahon-pardon.html",
    image:
      "https://static01.nyt.com/images/2025/11/07/multimedia/dc-pardons2-qcbj/dc-pardons2-qcbj-mediumSquareAt3X.jpg",
  },
] satisfies RawPost[];

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) throw "process.env.OPENAI_API_KEY is not set";

const SYSTEM_PROMPT = `You are an expert news article analyst.

Given a news article's title and description, condense the key factual
information into a single concise headline.

Your knowledge cutoff is 2024-06 so your responses must be based solely on the
provided information.

Title: Judge Blocks National Guard From Portland and Says Trump Overstepped His Authority
Description: Law enforcement officers guarding a federal immigration center in Portland, Ore., during protests last month.

A good output would be
{
  "headline": "Judge Rules Against Trump's Deployment of National Guard in Portland"
}
`;

const betterHeadlineSchema = z.object({
  headline: z.string().min(1).max(200),
});

const agent = createAgent({
  model: new ChatOpenAI({
    model: "gpt-5-nano",
    apiKey: OPENAI_API_KEY,
  }).bindTools([{ type: "web_search_preview" }]),
  responseFormat: betterHeadlineSchema,
});

export const expandRawNewsPost = async (rawNewsPost: RawPost) => {
  const userPrompt = `Title: ${rawNewsPost.title}
Description: ${rawNewsPost.description}
  
Rewrite the above news article title and description into a concise headline (max 200 characters).`;
  const response = await agent.invoke({
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
  });

  return response.structuredResponse;
};
