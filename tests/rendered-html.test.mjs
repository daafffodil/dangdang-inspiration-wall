import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the completed inspiration wall", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>铛铛一下 · 灵感墙<\/title>/);
  assert.match(html, /\/cards\/effect-01\.png/);
  assert.match(html, /\/cards\/effect-10\.png/);
  assert.doesNotMatch(
    html,
    /生成中|继续精修|不喜欢|视觉DNA|状态|标签|来源平台/,
  );
  assert.match(html, /http:\/\/localhost\/og\.png/);
});

test("keeps the wall content minimal and complete", async () => {
  const [cards, css, component] = await Promise.all([
    readFile(new URL("../data/cards.json", import.meta.url), "utf8").then(
      JSON.parse,
    ),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/InspirationWall.tsx", import.meta.url), "utf8"),
  ]);

  assert.equal(cards.length, 10);
  for (const card of cards) {
    assert.match(card.id, /^I-\d{8}-\d{2}$/);
    assert.match(card.effect, /^\/cards\/effect-\d{2}\.png$/);
    assert.ok(card.source.kind === "image" || card.source.kind === "text");
  }

  assert.doesNotMatch(css, /box-shadow|border-radius/);
  assert.doesNotMatch(css, /(^|\n)\s*columns\s*:|break-inside|nth-child/);
  assert.match(
    css,
    /grid-template-columns:\s*repeat\(5,\s*minmax\(0,\s*1fr\)\)/,
  );
  assert.match(css, /aspect-ratio:\s*3\s*\/\s*4/);
  assert.match(css, /rotateY\(180deg\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(component, /useState<Set<string>>/);
  assert.match(component, /const next = new Set\(current\)/);
  assert.match(component, /next\.add\(cardId\)/);
  assert.match(component, /next\.delete\(cardId\)/);
});
