import { RawPost } from "@/src/rss/ingest";

export const POSTS = {
  // "katy perry goes to space again"
  // `bun run scripts/post.ts katy_perry_goes_to_space_again`
  katy_perry_goes_to_space_again: {
    source: "NYTimes",
    title: "Katy Perry Goes to Space Again, This Time in 'Starstruck'",
    link: "https://www.nytimes.com/2024/06/05/movies/katy-perry-starstruck.html",
    description:
      "In her acting debut, the pop star plays an aspiring astronaut who gets a chance to go to space on a commercial flight.",
    imageDescription:
      "Katy Perry as Jessica in the film “Starstruck,” which is streaming on Peacock.",
    categories: ["Movies", "Space", "Entertainment"],
    image:
      "https://static01.nyt.com/images/2024/06/05/multimedia/05starstruck-perry1/05starstruck-perry1-superJumbo.jpg",
    datePublished: new Date("2024-06-05T10:00:00Z"),
    betterHeadline:
      "Katy Perry Makes Acting Debut in Starstruck as Aspiring Astronaut Getting a Space Ride on a Commercial Flight",
  },
  // "new ai tool revolutionizes healthcare diagnostics"
  // `bun run scripts/post.ts new_ai_tool_revolutionizes_healthcare_diagnostics`
  new_ai_tool_revolutionizes_healthcare_diagnostics: {
    source: "Wired",
    title: "New AI Tool Revolutionizes Healthcare Diagnostics",
    link: "https://www.wired.com/story/new-ai-tool-revolutionizes-healthcare-diagnostics/",
    description:
      "A groundbreaking AI system is set to transform the way medical diagnoses are made, promising faster and more accurate results.",
    imageDescription:
      "A doctor using an AI-powered diagnostic tool in a modern clinic setting.",
    categories: ["Health", "Technology", "AI"],
    image:
      "https://media.wired.com/photos/64a1f2e5e4b0f3b5f8c9d123/191:100/w_1280,c_limit/New-AI-Tool-Revolutionizes-Healthcare-Diagnostics.jpg",
    datePublished: new Date("2024-06-04T15:30:00Z"),
    betterHeadline:
      "Groundbreaking AI System Set to Transform Medical Diagnoses with Faster, More Accurate Results",
  },
} satisfies Record<string, RawPost & { betterHeadline: string }>;
