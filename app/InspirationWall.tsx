"use client";

import { useState } from "react";
import cardsData from "../data/cards.json";

type ImageSource = {
  kind: "image";
  src: string;
  alt: string;
};

type TextSource = {
  kind: "text";
  text: string;
};

type InspirationCard = {
  id: string;
  effect: string;
  effectAlt: string;
  source: ImageSource | TextSource;
};

const cards = cardsData as InspirationCard[];

export default function InspirationWall() {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(
    () => new Set(),
  );

  const toggleCard = (cardId: string) => {
    setFlippedCards((current) => {
      const next = new Set(current);

      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }

      return next;
    });
  };

  return (
    <>
      <header className="site-header">
        <div className="site-brand">
          <img src="/brand-mark.png" alt="铛铛一下" />
          <h1>旧衣回收灵感</h1>
        </div>
      </header>

      <main className="wall" aria-label="旧衣回收灵感">
        {cards.map((card) => {
          const isFlipped = flippedCards.has(card.id);

          return (
            <button
              className={`card${isFlipped ? " is-flipped" : ""}`}
              id={card.id}
              key={card.id}
              type="button"
              aria-pressed={isFlipped}
              aria-label={
                isFlipped
                  ? `返回效果图：${card.effectAlt}`
                  : `查看灵感来源：${card.effectAlt}`
              }
              onClick={() => toggleCard(card.id)}
            >
              <span className="card-inner">
                <span className="card-face card-front">
                  <img src={card.effect} alt={card.effectAlt} />
                </span>

                <span className="card-face card-back">
                  {card.source.kind === "image" ? (
                    <img
                      className="source-image"
                      src={card.source.src}
                      alt={card.source.alt}
                    />
                  ) : (
                    <span className="source-text">{card.source.text}</span>
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </main>
    </>
  );
}
