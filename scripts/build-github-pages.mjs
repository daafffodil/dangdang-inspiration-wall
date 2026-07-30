import { access, copyFile, cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const docs = join(root, "docs");
const cards = JSON.parse(
  await readFile(join(root, "data", "cards.json"), "utf8"),
);

const ids = new Set();

for (const card of cards) {
  if (ids.has(card.id)) {
    throw new Error(`Duplicate card id: ${card.id}`);
  }

  ids.add(card.id);
  await access(join(root, "public", card.effect));

  if (card.source.kind === "image") {
    await access(join(root, "public", card.source.src));
  }
}

await mkdir(join(docs, "cards"), { recursive: true });
await cp(join(root, "public", "cards"), join(docs, "cards"), {
  recursive: true,
  force: true,
});
await copyFile(
  join(root, "public", "brand-mark.png"),
  join(docs, "brand-mark.png"),
);
await copyFile(join(root, "public", "og.png"), join(docs, "og.png"));
await writeFile(
  join(docs, "cards.json"),
  `${JSON.stringify(cards, null, 2)}\n`,
  "utf8",
);
await writeFile(join(docs, ".nojekyll"), "", "utf8");

console.log(`GitHub Pages site ready with ${cards.length} cards.`);
