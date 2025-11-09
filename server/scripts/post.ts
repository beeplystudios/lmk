import { RawPost } from "@/src/rss/ingest";

export const POSTS = {
  // lmk "katy perry goes to space again"
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
  new_keyboard_doubling_as_a_vibrator_hits_on_market: {
    source: "NYTimes",
    title: "New Keyboard Doubling as a Vibrator Hits on Market",
    description:
      "The latest innovation in personal computing comes with unexpected features that are sure to excite users.",
    link: "https://www.nytimes.com/2024/05/20/technology/vibrating-keyboard.html",
    imageDescription:
      "The new vibrating keyboard model VibeType 3000, designed for both typing and personal pleasure.",
    categories: ["Technology", "Gadgets", "Lifestyle"],
    image:
      "https://static01.nyt.com/images/2024/05/20/multimedia/20vibetypes-1/20vibetypes-1-superJumbo.jpg",
    datePublished: new Date("2024-05-20T15:30:00Z"),
    betterHeadline:
      "VibeType 3000: The New Keyboard That Also Functions as a Vibrator Hits the Market",
  },
} satisfies Record<string, RawPost & { betterHeadline: string }>;
