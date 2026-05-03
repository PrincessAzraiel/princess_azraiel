import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/DoNotClick/",
          "/bam/",
          "/aiinfection/",
          "/itf2/",
          "/banner0/",
          "/rps/",
          "/send/",
          "/typing/",
          "/lovebombing/",
          "/the25/",
          "/stopped-buttclicker/",
          "/stopped-confession/",
          "/stopped-corruption3/",
          "/stopped-trick-or-treat/",
          "/patreon-hypnosis/",
          "/api/",
          "/updates/test/",
          "/womensday/",
          "/yandere/patreon300/",
          "/yandere/patreon500/",
          "/yandere/patreon600/",
          "/yandere/patreon700/",
          "/yandere/patreon800/",
          "/yandere/patreon900/",
        ],
      },
    ],
    sitemap: "https://princessazraiel.com/sitemap.xml",
  };
}
