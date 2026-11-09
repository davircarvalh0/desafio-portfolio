import { build } from "esbuild";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { basename, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";
import { themeBootstrap } from "../lib/theme-bootstrap.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const argument = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const output = resolve(root, argument("--output", "preview/index.html"));
const assetPrefix = argument("--asset-prefix", "../public");
const galleryOutput = resolve(dirname(output), "desafios.html");
if (output === galleryOutput) throw new Error("Escolha outro nome para a página inicial.");

const styles = resolve(root, "app/globals.css");
const { css } = await postcss([tailwind({ base: root })]).process(await readFile(styles, "utf8"), { from: styles });
const result = await build({
  entryPoints: [resolve(root, "scripts/preview-entry.tsx")],
  bundle: true,
  write: false,
  minify: true,
  format: "iife",
  platform: "browser",
  jsx: "automatic",
  tsconfig: resolve(root, "tsconfig.json"),
  define: {
    "process.env.NODE_ENV": '"production"',
    "process.env.NEXT_PUBLIC_BASE_PATH": JSON.stringify(assetPrefix),
  },

});

await mkdir(dirname(output), { recursive: true });
for (const [file, screen, title] of [[output, "home", "Davi Rosendo · Desafios CITi"], [galleryOutput, "challenges", "Os desafios · Davi Rosendo"]]) {
  const html = [
    '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
    "<title>" + title + "</title><script>" + themeBootstrap + "</script><style>" + css.replaceAll("</style", "<\\/style") + "</style></head><body>",
    '<div id="root" data-screen="' + screen + '" data-home="' + encodeURIComponent(basename(output)) + '"></div>',
    "<script>" + result.outputFiles[0].text.replaceAll("</script", "<\\/script") + "</script></body></html>",
  ].join("");
  await writeFile(file, html, "utf8");
}
console.log("Prévia independente:", output, galleryOutput);
