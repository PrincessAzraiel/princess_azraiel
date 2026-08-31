// Inlines the yandere assets into trailer.src.html -> yandere-trailer.html
// Run: node tools/trailer/build.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const pub = join(here, "..", "..", "public", "yandere");

const dataURI = (file, mime) =>
  `data:${mime};base64,${readFileSync(join(pub, file)).toString("base64")}`;

const out = readFileSync(join(here, "trailer.src.html"), "utf8")
  .replace("__IMG_A__", dataURI("yandere.webp", "image/webp"))
  .replace("__IMG_B__", dataURI("yandere_2.webp", "image/webp"))
  .replace("__IMG_C__", dataURI("3.png", "image/png"))
  .replace("__AUDIO__", dataURI("bg-audio.mp3", "audio/mpeg"));

const dest = join(here, "yandere-trailer.html");
writeFileSync(dest, out);
console.log(`built ${dest} — ${(out.length / 1048576).toFixed(2)} MB, fully self-contained`);
