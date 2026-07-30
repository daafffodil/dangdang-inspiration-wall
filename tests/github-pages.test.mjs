import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("builds a complete GitHub Pages site", async () => {
  const [cards, html, css, app] = await Promise.all([
    readFile(new URL("../docs/cards.json", import.meta.url), "utf8").then(
      JSON.parse,
    ),
    readFile(new URL("../docs/index.html", import.meta.url), "utf8"),
    readFile(new URL("../docs/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../docs/app.js", import.meta.url), "utf8"),
  ]);

  assert.equal(cards.length, 13);
  assert.equal(cards[0].id, "I-20260730-13");
  assert.match(html, /旧衣回收灵感 · 铛铛一下/);
  assert.match(html, /\.\/brand-mark\.png/);
  assert.match(
    css,
    /grid-template-columns:\s*repeat\(5,\s*minmax\(0,\s*1fr\)\)/,
  );
  assert.match(css, /--background:\s*#ffffff/);
  assert.match(css, /--source:\s*#ffffff/);
  assert.match(css, /aspect-ratio:\s*3\s*\/\s*4/);
  assert.match(app, /button\.classList\.toggle\("is-flipped"\)/);
  assert.match(app, /查看灵感来源/);
  assert.match(app, /返回效果图/);

  await access(new URL("../docs/.nojekyll", import.meta.url));

  for (const card of cards) {
    await access(new URL(`../docs${card.effect}`, import.meta.url));

    if (card.source.kind === "image") {
      await access(new URL(`../docs${card.source.src}`, import.meta.url));
    }
  }
});
