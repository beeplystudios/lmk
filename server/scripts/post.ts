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
      "https://compote.slate.com/images/9da96c06-14be-4ede-8177-1083c942ac99.jpeg?crop=1560%2C1040%2Cx0%2Cy0",
    datePublished: new Date("2025-11-05T10:00:00Z"),
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
      "https://assets.intersystems.com/dims4/default/51e5f91/2147483647/strip/true/crop/6951x4634+0+0/resize/1290x860!/quality/90/?url=http%3A%2F%2Finter-systems-brightspot.s3.amazonaws.com%2F35%2F45%2F0dfae8c14b51af282699ab00096f%2Fgettyimages-1326234214.jpg",
    datePublished: new Date("2025-11-05T10:00:00Z"),
    betterHeadline:
      "Groundbreaking AI System Set to Transform Medical Diagnoses with Faster, More Accurate Results",
  },
} satisfies Record<string, RawPost & { betterHeadline: string }>;
