const wall = document.querySelector("#wall");

function localAsset(path) {
  return `.${path}`;
}

function image(src, alt, priority = false) {
  const element = document.createElement("img");
  element.src = localAsset(src);
  element.alt = alt;
  element.decoding = "async";
  element.loading = priority ? "eager" : "lazy";
  return element;
}

function createCard(card, index) {
  const button = document.createElement("button");
  const inner = document.createElement("span");
  const front = document.createElement("span");
  const back = document.createElement("span");

  button.className = "card";
  button.id = card.id;
  button.type = "button";
  button.setAttribute("aria-pressed", "false");
  button.setAttribute("aria-label", `查看灵感来源：${card.effectAlt}`);

  inner.className = "card-inner";
  front.className = "card-face card-front";
  back.className = "card-face card-back";

  front.append(image(card.effect, card.effectAlt, index < 5));

  if (card.source.kind === "image") {
    const source = image(card.source.src, card.source.alt);
    source.className = "source-image";
    back.append(source);
  } else {
    const source = document.createElement("span");
    source.className = "source-text";
    source.textContent = card.source.text;
    back.append(source);
  }

  inner.append(front, back);
  button.append(inner);

  button.addEventListener("click", () => {
    const isFlipped = button.classList.toggle("is-flipped");
    button.setAttribute("aria-pressed", String(isFlipped));
    button.setAttribute(
      "aria-label",
      isFlipped
        ? `返回效果图：${card.effectAlt}`
        : `查看灵感来源：${card.effectAlt}`,
    );
  });

  return button;
}

fetch("./cards.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Unable to load cards: ${response.status}`);
    }

    return response.json();
  })
  .then((cards) => {
    wall.append(...cards.map(createCard));
  });
