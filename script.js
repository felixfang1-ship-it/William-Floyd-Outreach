const termsData = [
  {
    id: 1,
    term: "ROI",
    definition: "A location that we want to analyze."
  },
  {
    id: 2,
    term: "Resolution",
    definition: "How far apart two points must be to remain visible as separate structures."
  },
  {
    id: 3,
    term: "Voxel",
    definition: "The 3D version of a pixel."
  },
  {
    id: 4,
    term: "FOV",
    definition: "The total area or volume scanned."
  },
  {
    id: 5,
    term: "Noise",
    definition: "Variation in grayscale intensity that can make the image less clear."
  },
  {
    id: 6,
    term: "IPL",
    definition: "An analyzing tool used to help process data."
  }
];

const termsContainer = document.getElementById("terms");
const definitionsContainer = document.getElementById("definitions");
const statusText = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const resultCard = document.getElementById("resultCard");
const scoreText = document.getElementById("scoreText");
const wrongAnswers = document.getElementById("wrongAnswers");

let selectedTerm = null;
let selectedDefinition = null;
let matches = {};

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function renderBoard() {
  termsContainer.innerHTML = "";
  definitionsContainer.innerHTML = "";
  selectedTerm = null;
  selectedDefinition = null;
  matches = {};
  resultCard.classList.add("hidden");
  statusText.textContent = "Choose one vocabulary word and one definition to make a match.";

  const shuffledTerms = shuffle(termsData);
  const shuffledDefinitions = shuffle(termsData);

  shuffledTerms.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = item.term;
    card.dataset.id = item.id;
    card.dataset.type = "term";
    card.addEventListener("click", () => selectCard(card, "term"));
    termsContainer.appendChild(card);
  });

  shuffledDefinitions.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = item.definition;
    card.dataset.id = item.id;
    card.dataset.type = "definition";
    card.addEventListener("click", () => selectCard(card, "definition"));
    definitionsContainer.appendChild(card);
  });
}

function selectCard(card, type) {
  if (card.classList.contains("matched")) return;

  if (type === "term") {
    document.querySelectorAll('[data-type="term"]').forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    selectedTerm = card;
  } else {
    document.querySelectorAll('[data-type="definition"]').forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    selectedDefinition = card;
  }

  if (selectedTerm && selectedDefinition) {
    const termId = selectedTerm.dataset.id;
    const defId = selectedDefinition.dataset.id;

    matches[termId] = defId;

    selectedTerm.classList.remove("selected");
    selectedDefinition.classList.remove("selected");
    selectedTerm.classList.add("matched");
    selectedDefinition.classList.add("matched");

    statusText.textContent = `Matched: ${selectedTerm.textContent}`;

    selectedTerm = null;
    selectedDefinition = null;
  }
}

function evaluateGame() {
  let correct = 0;
  wrongAnswers.innerHTML = "";

  termsData.forEach(item => {
    const chosen = matches[item.id];
    if (String(item.id) === String(chosen)) {
      correct++;
      const correctDiv = document.createElement("div");
      correctDiv.className = "correct-item";
      correctDiv.textContent = `${item.term}: Correct`;
      wrongAnswers.appendChild(correctDiv);
    } else {
      const chosenItem = termsData.find(entry => String(entry.id) === String(chosen));
      const wrongDiv = document.createElement("div");
      wrongDiv.className = "wrong-item";
      wrongDiv.innerHTML = `
        <strong>${item.term}</strong><br>
        Your answer: ${chosenItem ? chosenItem.definition : "No match selected"}<br>
        Correct answer: ${item.definition}
      `;
      wrongAnswers.appendChild(wrongDiv);
    }
  });

  scoreText.textContent = `You got ${correct} out of ${termsData.length} correct.`;
  resultCard.classList.remove("hidden");
}

submitBtn.addEventListener("click", evaluateGame);
resetBtn.addEventListener("click", renderBoard);

renderBoard();
