// Builds each trailer into one self-contained HTML file.
//   shell.html + engine.js + <name>.trailer.js + inlined assets  ->  <name>-trailer.html
// Run: node tools/trailer/build.mjs            (all trailers)
//      node tools/trailer/build.mjs typing2    (just one)
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const pub = join(here, "..", "..", "public");

const TRAILERS = {
  yandere: {
    module: "yandere.trailer.js",
    out: "yandere-trailer.html",
    title: "THE YANDERE EXPERIENCE",
    h1: "Yandere Experience",
    dur: 56,
    assets: {
      __IMG_A__: ["yandere/yandere.webp", "image/webp"],
      __IMG_B__: ["yandere/yandere_2.webp", "image/webp"],
      __IMG_C__: ["yandere/3.png", "image/png"],
      __AUDIO__: ["yandere/bg-audio.mp3", "audio/mpeg"],
    },
  },
  typing2: {
    module: "typing2.trailer.js",
    out: "typing2-trailer.html",
    title: "TYPING PROTOCOL",
    h1: "Typing Protocol",
    dur: 50,
    // No __AUDIO__: the score is fully synthesised, which keeps this file ~1 MB
    // instead of the ~14 MB the 10 MB start.mp3 would cost as a data URI.
    assets: {
      __IMG_A__: ["typing2/images/4.png", "image/png"],
      __IMG_B__: ["typing2/images/7.png", "image/png"],
      __IMG_C__: ["typing2/images/9.png", "image/png"],
    },
  },
};

const dataURI = (file, mime) =>
  `data:${mime};base64,${readFileSync(join(pub, file)).toString("base64")}`;

const shell = readFileSync(join(here, "shell.html"), "utf8");
const engine = readFileSync(join(here, "engine.js"), "utf8");

const wanted = process.argv.slice(2);
const names = wanted.length ? wanted : Object.keys(TRAILERS);

for (const name of names) {
  const cfg = TRAILERS[name];
  if (!cfg) {
    console.error(`unknown trailer "${name}" — have: ${Object.keys(TRAILERS).join(", ")}`);
    process.exitCode = 1;
    continue;
  }

  let mod = readFileSync(join(here, cfg.module), "utf8");
  for (const [token, [file, mime]] of Object.entries(cfg.assets)) {
    mod = mod.replace(token, dataURI(file, mime));
  }
  // any asset token the config did not supply resolves to "" (no bed audio)
  mod = mod.replace(/"__[A-Z_]+__"/g, '""');

  const out = shell
    .replace("__TITLE__", cfg.title)
    .replace("__H1__", cfg.h1)
    .replace("__DUR__", String(cfg.dur))
    .replace("__TRAILER__", () => mod)
    .replace("__ENGINE__", () => engine);

  const dest = join(here, cfg.out);
  writeFileSync(dest, out);
  console.log(`built ${cfg.out} — ${(out.length / 1048576).toFixed(2)} MB, fully self-contained`);
}
