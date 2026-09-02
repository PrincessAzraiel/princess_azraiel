// Local preview/export host for the trailer renderers.
//   GET  /            -> index of the built trailers
//   GET  /<name>      -> that built trailer page (e.g. /typing2, /yandere)
//   POST /save?name=x -> writes the posted video into tools/trailer/out/
// Run: node tools/trailer/serve.mjs   then open http://localhost:4599
import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "out");
const TRAILERS = { yandere: "yandere-trailer.html", typing2: "typing2-trailer.html" };

createServer((req, res) => {
  const url = new URL(req.url, "http://localhost:4599");

  if (req.method === "POST" && url.pathname === "/save") {
    const name = basename(url.searchParams.get("name") || "trailer.mp4");
    const parts = [];
    req.on("data", (c) => parts.push(c));
    req.on("end", () => {
      const body = Buffer.concat(parts);
      mkdirSync(outDir, { recursive: true });
      const dest = join(outDir, name);
      writeFileSync(dest, body);
      console.log(`saved ${dest} (${(body.length / 1048576).toFixed(2)} MB)`);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`out/${name} (${(body.length / 1048576).toFixed(2)} MB)`);
    });
    return;
  }

  try {
    // /out/<name> serves a rendered video back for checking
    if (url.pathname.startsWith("/out/")) {
      const body = readFileSync(join(outDir, basename(url.pathname)));
      const range = req.headers.range;                 // players need byte ranges to seek
      if (range) {
        const m = /bytes=(\d*)-(\d*)/.exec(range);
        const start = m[1] ? parseInt(m[1], 10) : 0;
        const end = m[2] ? parseInt(m[2], 10) : body.length - 1;
        res.writeHead(206, {
          "Content-Type": "video/mp4",
          "Accept-Ranges": "bytes",
          "Content-Range": `bytes ${start}-${end}/${body.length}`,
          "Content-Length": end - start + 1,
        });
        res.end(body.subarray(start, end + 1));
        return;
      }
      res.writeHead(200, {
        "Content-Type": "video/mp4",
        "Accept-Ranges": "bytes",
        "Content-Length": body.length,
      });
      res.end(body);
      return;
    }
    const key = url.pathname.replace(/^\/+|\/+$/g, "");
    if (key && TRAILERS[key]) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(readFileSync(join(here, TRAILERS[key])));
      return;
    }
    const links = Object.keys(TRAILERS)
      .map((k) => `<li><a href="/${k}">${k}</a> &mdash; ${TRAILERS[k]}</li>`)
      .join("");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<meta charset="utf-8"><body style="background:#07000a;color:#f9a8d4;
      font:14px ui-monospace,monospace;padding:40px"><h1>trailers</h1><ul>${links}</ul>`);
  } catch (e) {
    res.writeHead(500);
    res.end(String(e));
  }
}).listen(4599, () => console.log("trailer host on http://localhost:4599"));
