import { readdirSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
import ComicClient, { type Chapter } from "./ComicClient";

export const metadata: Metadata = {
  title: "The Comic — Princess Azraiel",
  description: "Read the Princess Azraiel comic.",
};

function getChapters(): Chapter[] {
  const comicDir = join(process.cwd(), "public", "comic");

  let folders: number[];
  try {
    folders = readdirSync(comicDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && /^\d+$/.test(d.name))
      .map((d) => parseInt(d.name))
      .sort((a, b) => a - b);
  } catch {
    return [];
  }

  return folders.map((num) => {
    const chapterDir = join(comicDir, String(num));
    const files = readdirSync(chapterDir).filter((f) => /^\d+\.png$/i.test(f));
    // count pages excluding cover (0.png)
    const pageCount = files.filter((f) => f !== "0.png").length;
    return {
      num,
      title: `Chapter ${num}`,
      cover: `/comic/${num}/0.png`,
      pages: Array.from({ length: pageCount }, (_, i) => `/comic/${num}/${i + 1}.png`),
    };
  });
}

export default function ComicPage() {
  const chapters = getChapters();
  return <ComicClient chapters={chapters} />;
}
