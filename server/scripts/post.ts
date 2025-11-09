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
  },
} satisfies Record<string, RawPost>;
