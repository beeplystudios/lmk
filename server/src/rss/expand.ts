import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";
import z from "zod";
import type { RawNewsPost } from "./ingest";

export const EXAMPLE_RAW_NEWS_POST = [
  {
    source: "NYTimes",
    title: "Biden Warns of a ‘Very, Very Dark Moment’ as He Hits Out at Trump",
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
] satisfies RawNewsPost[];

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) throw "process.env.OPENAI_API_KEY is not set";

const SYSTEM_PROMPT = `You are an expert news article analyst.

Given a news article's title and description, extract the 3 to 10 most important
factual points from the article. Note that the title and description may not
contain all the information in the article, so you may need to infer some facts
based on general world knowledge. You have been given access to a web search
tool to help you find additional information if needed.

The goal of this task is to be able to more effectively index and search points
discussed in news articles. As such, focus on extracting clear, concise, and
verifiable facts. Avoid using language that is vague, ambiguous, subjective, or
requiring context beyond what is provided. Do not use the words "the", "a", 
"it", or similar at the start of a fact---each fact should stand on its own. If
you are unsure about a fact, use the web search tool or omit it. Prioritize
factual accuracy over quantity! If you are unsure about information, it's better
to just summarize the facts present in the title and description.

The facts should be concise, clear, and written in complete sentences. Each fact
should be between 1 and 100 characters long. Return the facts as a JSON object
with a single key "facts" that maps to an array of strings.

As an example, given the following title and description:
Title: Judge Blocks National Guard From Portland and Says Trump Overstepped His Authority
Description: Law enforcement officers guarding a federal immigration center in Portland, Ore., during protests last month.

The correct output would be:
{
  "facts": [
    "A judge has blocked the deployment of the National Guard in Portland, Oregon.",
    "A federal judge ruled that former President Trump's deployment of the National Guard in Portland overstepped his authority.",
    "The National Guard was sent to Portland to guard a federal immigration center during protests.",
    "The judge's ruling emphasizes the limits of presidential power in domestic law enforcement actions.",
  ]
}
`;

const factsSchema = z.object({
  facts: z
    .array(z.string().min(1).max(100).describe("A single factual point."))
    .min(3)
    .max(10)
    .describe(
      "A list of important factual points extracted from the news article."
    ),
});

const agent = createAgent({
  model: new ChatOpenAI({
    model: "gpt-5-nano",
    apiKey: OPENAI_API_KEY,
  }).bindTools([{ type: "web_search_preview" }]),
  responseFormat: factsSchema,
});

export const expandRawNewsPost = async (rawNewsPost: RawNewsPost) => {
  const userPrompt = `Title: ${rawNewsPost.title}
Description: ${rawNewsPost.description}
  
Extract the important factual points from the above news article.`;
  const response = await agent.stream(
    {
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    },
    {
      streamMode: "debug",
    }
  );

  for await (const chunk of response) {
    console.log(chunk);
  }
};
