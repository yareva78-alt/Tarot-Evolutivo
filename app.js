const deck = [
  {
    name: "La Sacerdotisa",
    symbol: "☾",
    keyword: "Escucha interna",
    colors: ["#33294f", "#2f7371"],
    light: "Hay una verdad sutil que ya percibes, aunque todavia no tenga forma racional.",
    shadow: "La duda aparece cuando buscas permiso externo para una certeza que nace dentro.",
    practice: "Reserva diez minutos de silencio y escribe la primera frase que surja sin corregirla.",
  },
  {
    name: "El Mago",
    symbol: "✶",
    keyword: "Accion consciente",
    colors: ["#6d3f6f", "#d1933b"],
    light: "Tienes recursos suficientes para empezar; la claridad llegara mientras haces.",
    shadow: "Puedes estar esperando el momento perfecto para evitar exponerte al primer paso.",
    practice: "Elige una accion pequena, medible y realizable hoy antes de dormir.",
  },
  {
    name: "La Emperatriz",
    symbol: "✿",
    keyword: "Cuidado creador",
    colors: ["#b85d74", "#5e7754"],
    light: "Lo que nutres con presencia se vuelve fertil, incluso si avanza despacio.",
    shadow: "Dar demasiado puede ser una forma elegante de abandonar tus propias necesidades.",
    practice: "Haz una lista de tres limites que protegen tu energia creativa.",
  },
  {
    name: "El Ermitaño",
    symbol: "✧",
    keyword: "Sabiduria propia",
    colors: ["#4f5f7f", "#33294f"],
    light: "La pausa no es retroceso; es el espacio donde recuperas tu brujula.",
    shadow: "Aislarte puede confundirse con madurez cuando en realidad hay miedo a pedir apoyo.",
    practice: "Pregunta: que necesito comprender antes de decidir, y a quien puedo contarselo?",
  },
  {
    name: "La Fuerza",
    symbol: "◆",
    keyword: "Ternura firme",
    colors: ["#9b5a43", "#b85d74"],
    light: "Tu poder crece cuando dejas de pelear contigo y aprendes a conducirte con respeto.",
    shadow: "La autoexigencia puede estar disfrazada de disciplina.",
    practice: "Cambia un deber por una eleccion: 'elijo hacer esto porque...'.",
  },
  {
    name: "La Rueda",
    symbol: "◉",
    keyword: "Cambio ciclico",
    colors: ["#2f7371", "#d1933b"],
    light: "La vida esta moviendo piezas; adaptarte te dara mas fuerza que controlar cada detalle.",
    shadow: "Resistir el cambio te mantiene leal a una version antigua de ti.",
    practice: "Nombra que termina, que empieza y que aprendizaje llevas contigo.",
  },
  {
    name: "La Templanza",
    symbol: "♢",
    keyword: "Integracion",
    colors: ["#5e7754", "#4f5f7f"],
    light: "No necesitas elegir entre extremos; la respuesta madura mezcla partes que antes separabas.",
    shadow: "Postergar una conversacion puede estar manteniendo una paz superficial.",
    practice: "Define una conversacion pendiente y el tono con el que quieres entrar en ella.",
  },
  {
    name: "La Luna",
    symbol: "◐",
    keyword: "Inconsciente",
    colors: ["#33294f", "#5c4a78"],
    light: "Hay emociones antiguas activadas; escucharlas sin obedecerlas te devolvera centro.",
    shadow: "La confusion aumenta cuando intentas resolver desde la ansiedad.",
    practice: "Antes de actuar, identifica si hablas desde miedo, deseo, memoria o intuicion.",
  },
  {
    name: "El Sol",
    symbol: "☼",
    keyword: "Vitalidad",
    colors: ["#d1933b", "#b85d74"],
    light: "Algo se vuelve simple cuando permites que tu deseo sea visible.",
    shadow: "Minimizar tu brillo puede ser una forma de pertenecer a espacios que ya no te expanden.",
    practice: "Comparte un avance, una idea o una alegria sin justificarla.",
  },
  {
    name: "El Mundo",
    symbol: "◎",
    keyword: "Cierre completo",
    colors: ["#2f7371", "#5e7754"],
    light: "Estas integrando una etapa; no vuelvas pequeno lo que ya aprendiste a sostener.",
    shadow: "Cerrar tambien implica dejar de explicar tu crecimiento a quien no quiere verlo.",
    practice: "Escribe una despedida breve para la version de ti que ya cumplio su funcion.",
  },
];

const spreadLabels = {
  one: ["Mensaje central"],
  three: ["Raiz", "Movimiento", "Integracion"],
  mirror: ["Lo visible", "La sombra", "El puente"],
};

const areaPrompts = {
  proposito: "tu sentido de direccion",
  amor: "la forma en que te vinculas",
  trabajo: "tu expresion y trabajo creativo",
  sombra: "lo que pide ser mirado sin juicio",
  cambio: "la transicion que estas atravesando",
};

const toneOpeners = {
  suave: "Con suavidad, la carta sugiere",
  directo: "De forma directa, esta carta marca",
  profundo: "En una capa mas profunda, el simbolo revela",
};

const form = document.querySelector("#reading-form");
const cardsEl = document.querySelector("#cards");
const interpretationEl = document.querySelector("#interpretation");
const spreadTitleEl = document.querySelector("#spread-title");
const clearButton = document.querySelector("#clear-reading");

function hashText(text) {
  return [...text].reduce((total, char) => total + char.charCodeAt(0), 0);
}

function drawCards(count, seed) {
  const available = [...deck];
  const drawn = [];
  let cursor = seed || Date.now();

  for (let index = 0; index < count; index += 1) {
    cursor = (cursor * 9301 + 49297) % 233280;
    const cardIndex = cursor % available.length;
    drawn.push(available.splice(cardIndex, 1)[0]);
  }

  return drawn;
}

function renderCards(cards, positions) {
  cardsEl.className = `cards ${cards.length === 1 ? "single" : ""}`;
  cardsEl.innerHTML = cards
    .map((card, index) => {
      const [cardA, cardB] = card.colors;
      return `
        <article class="tarot-card" style="--card-a: ${cardA}; --card-b: ${cardB}; animation-delay: ${index * 80}ms">
          <div class="card-position">${positions[index]}</div>
          <div class="card-symbol" aria-hidden="true">${card.symbol}</div>
          <div>
            <h3 class="card-name">${card.name}</h3>
            <div class="card-keyword">${card.keyword}</div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderInterpretation(cards, positions, context) {
  const intentionText = context.intention
    ? ` respecto a "${context.intention}"`
    : " para la intencion que aun esta tomando forma";

  interpretationEl.className = "interpretation";
  interpretationEl.innerHTML = cards
    .map((card, index) => {
      return `
        <article class="reading-card">
          <h3>${positions[index]} · ${card.name}</h3>
          <p><strong>Luz:</strong> ${toneOpeners[context.tone]} ${card.light.toLowerCase()} Esto conversa con ${areaPrompts[context.area]}${intentionText}.</p>
          <p><strong>Sombra:</strong> ${card.shadow}</p>
          <p><strong>Practica:</strong> ${card.practice}</p>
        </article>
      `;
    })
    .join("");

  const synthesis = document.createElement("article");
  synthesis.className = "integration";
  synthesis.innerHTML = `
    <h3>Pregunta de integracion</h3>
    <p>${buildQuestion(cards, context)}</p>
  `;
  interpretationEl.appendChild(synthesis);
}

function buildQuestion(cards, context) {
  const names = cards.map((card) => card.keyword.toLowerCase()).join(", ");
  const base = {
    suave: "Que gesto amable puede ayudarte a vivir",
    directo: "Que decision concreta demuestra que ya elegiste",
    profundo: "Que patron interno se transforma cuando aceptas",
  };

  return `${base[context.tone]} ${names} en ${areaPrompts[context.area]}?`;
}

function resetReading() {
  spreadTitleEl.textContent = "Pulsa revelar para abrir el mazo";
  cardsEl.className = "cards empty";
  cardsEl.innerHTML = `
    <article class="card-back" aria-hidden="true">
      <div class="card-orbit"></div>
      <div class="card-moon"></div>
      <div class="card-line"></div>
    </article>
    <article class="card-back ghost-card" aria-hidden="true">
      <div class="card-orbit"></div>
      <div class="card-moon"></div>
      <div class="card-line"></div>
    </article>
    <article class="card-back ghost-card" aria-hidden="true">
      <div class="card-orbit"></div>
      <div class="card-moon"></div>
      <div class="card-line"></div>
    </article>
  `;
  interpretationEl.className = "interpretation empty-state";
  interpretationEl.innerHTML = `
    <p>
      Formula la intencion con honestidad. La lectura aparecera aqui con simbolo,
      sombra, aprendizaje y una practica concreta para integrar.
    </p>
  `;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const spread = formData.get("spread");
  const intention = document.querySelector("#intention").value.trim();
  const area = document.querySelector("#area").value;
  const tone = document.querySelector("#tone").value;
  const positions = spreadLabels[spread];
  const seed = hashText(`${intention}-${area}-${tone}-${spread}-${new Date().toDateString()}`);
  const cards = drawCards(positions.length, seed);

  spreadTitleEl.textContent =
    spread === "one" ? "Carta guia" : spread === "three" ? "Camino evolutivo" : "Espejo interno";

  renderCards(cards, positions);
  renderInterpretation(cards, positions, { intention, area, tone });
});

clearButton.addEventListener("click", resetReading);
