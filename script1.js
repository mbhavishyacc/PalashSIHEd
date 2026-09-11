// ---------------------------------------------------------------------------
// Local offline dictionary — used for INSTANT feedback while typing, and as
// a fallback when the IndicTrans2 backend is unreachable (keeps this usable
// offline in a classroom with no connectivity).
// ---------------------------------------------------------------------------
const phrasePairs = [
  { hindi: "नमस्ते", santhali: "ᱡᱚᱦᱟᱨ", roman: "Johar", category: "greeting" },
  { hindi: "नमस्ते, आपका नाम क्या है?", santhali: "ᱡᱚᱦᱟᱨ, ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱪᱮᱫ?", category: "greeting" },
  { hindi: "आप कैसे हैं?", santhali: "ᱟᱢ ᱪᱮᱞᱠᱟ ᱢᱮᱱᱟᱢ?", category: "greeting" },
  { hindi: "मैं ठीक हूँ।", santhali: "ᱤᱧ ᱵᱷᱟᱞᱟ ᱜᱮᱭᱟᱹᱧ।", category: "greeting" },
  { hindi: "बहुत अच्छा!", santhali: "ᱟᱹᱰᱤ ᱵᱷᱟᱞᱟ!", category: "encouragement" },
  { hindi: "बैठ जाओ।", santhali: "ᱫᱚᱦᱚ ᱢᱮ।", category: "classroom" },
  { hindi: "पुस्तक खोलो।", santhali: "ᱯᱚᱛᱚᱵ ᱡᱷᱤᱡ ᱢᱮ।", category: "classroom" },
  { hindi: "आज हम गिनती सीखेंगे।", santhali: "ᱛᱮᱦᱮᱧ ᱟᱵᱚ ᱞᱮᱠᱷᱟ ᱥᱤᱠᱷᱟᱣᱟ।", category: "lesson" },
  { hindi: "आज हम पढ़ेंगे।", santhali: "ᱛᱮᱦᱮᱧ ᱟᱵᱚ ᱯᱟᱲᱦᱟᱣᱟ।", category: "lesson" },
  { hindi: "पानी पी लो।", santhali: "ᱫᱟᱜ ᱧᱩ ᱢᱮ।", category: "care" },
  { hindi: "ध्यान से सुनो।", santhali: "ᱡᱚᱛᱚ ᱞᱟᱹᱭ ᱢᱮ।", category: "classroom" },
  { hindi: "शाबाश!", santhali: "ᱥᱟᱵᱟᱥ!", category: "encouragement" },
  { hindi: "फिर से बोलो।", santhali: "ᱫᱚᱦᱲᱟ ᱨᱚᱲ ᱢᱮ।", category: "classroom" },
  { hindi: "क्या तुम तैयार हो?", santhali: "ᱪᱮᱫ ᱟᱢ ᱥᱟᱹᱜᱟᱲ ᱢᱮᱱᱟᱢ?", category: "classroom" },
  { hindi: "हाँ", santhali: "ᱦᱚᱭ", category: "common" },
  { hindi: "नहीं", santhali: "ᱵᱟᱝ", category: "common" },
  { hindi: "पानी", santhali: "ᱫᱟᱜ", category: "common" },
  { hindi: "पुस्तक", santhali: "ᱯᱚᱛᱚᱵ", category: "common" },
  { hindi: "बच्चे", santhali: "ᱦᱚᱯᱚᱱ", category: "common" },
  { hindi: "घर", santhali: "ᱚᱲᱟᱜ", category: "common" },
  { hindi: "एक", santhali: "ᱢᱤᱫ", category: "numbers" },
  { hindi: "दो", santhali: "ᱵᱟᱨ", category: "numbers" },
  { hindi: "तीन", santhali: "ᱯᱮ", category: "numbers" },
  { hindi: "चार", santhali: "ᱯᱩᱱ", category: "numbers" },
  { hindi: "पाँच", santhali: "ᱢᱚᱬᱮ", category: "numbers" },
  { hindi: "ᱡᱚᱦᱟᱨ", santhali: "नमस्ते", category: "greeting" },
  { hindi: "ᱟᱢ ᱪᱮᱞᱠᱟ ᱢᱮᱱᱟᱢ?", santhali: "आप कैसे हैं?", category: "greeting" },
  { hindi: "ᱤᱧ ᱵᱷᱟᱞᱟ ᱜᱮᱭᱟᱹᱧ।", santhali: "मैं ठीक हूँ।", category: "greeting" },
  { hindi: "ᱟᱹᱰᱤ ᱵᱷᱟᱞᱟ!", santhali: "बहुत अच्छा!", category: "encouragement" },
  { hindi: "ᱯᱚᱛᱚᱵ ᱡᱷᱤᱡ ᱢᱮ।", santhali: "पुस्तक खोलो।", category: "classroom" },
  { hindi: "ᱫᱟᱜ ᱧᱩ ᱢᱮ।", santhali: "पानी पी लो।", category: "care" },
  { hindi: "ᱦᱚᱭ", santhali: "हाँ", category: "common" },
  { hindi: "ᱵᱟᱝ", santhali: "नहीं", category: "common" },
  { hindi: "ᱫᱟᱜ", santhali: "पानी", category: "common" },
  { hindi: "ᱯᱚᱛᱚᱵ", santhali: "पुस्तक", category: "common" },
  { hindi: "ᱦᱚᱯᱚᱱ", santhali: "बच्चे", category: "common" },
  { hindi: "ᱚᱲᱟᱜ", santhali: "घर", category: "common" },
  { hindi: "ᱢᱤᱫ", santhali: "एक", category: "numbers" },
  { hindi: "ᱵᱟᱨ", santhali: "दो", category: "numbers" },
  { hindi: "ᱯᱮ", santhali: "तीन", category: "numbers" },
  { hindi: "ᱯᱩᱱ", santhali: "चार", category: "numbers" },
  { hindi: "ᱢᱚᱬᱮ", santhali: "पाँच", category: "numbers" }
];

const wordPairs = [
  ["नमस्ते", "ᱡᱚᱦᱟᱨ"], ["आप", "ᱟᱢ"], ["आपका", "ᱟᱢᱟᱜ"], ["नाम", "ᱧᱩᱛᱩᱢ"], ["क्या", "ᱪᱮᱫ"],
  ["मैं", "ᱤᱧ"], ["ठीक", "ᱵᱷᱟᱞᱟ"], ["बहुत", "ᱟᱹᱰᱤ"], ["अच्छा", "ᱵᱷᱟᱞᱟ"], ["पुस्तक", "ᱯᱚᱛᱚᱵ"],
  ["खोलो", "ᱡᱷᱤᱡ"], ["पानी", "ᱫᱟᱜ"], ["पी", "ᱧᱩ"], ["बच्चे", "ᱦᱚᱯᱚᱱ"], ["घर", "ᱚᱲᱟᱜ"],
  ["हाँ", "ᱦᱚᱭ"], ["नहीं", "ᱵᱟᱝ"], ["एक", "ᱢᱤᱫ"], ["दो", "ᱵᱟᱨ"], ["तीन", "ᱯᱮ"],
  ["चार", "ᱯᱩᱱ"], ["पाँच", "ᱢᱚᱬᱮ"], ["ᱟᱢ", "आप"], ["ᱟᱢᱟᱜ", "आपका"], ["ᱧᱩᱛᱩᱢ", "नाम"],
  ["ᱤᱧ", "मैं"], ["ᱵᱷᱟᱞᱟ", "अच्छा"], ["ᱯᱚᱛᱚᱵ", "पुस्तक"], ["ᱫᱟᱜ", "पानी"], ["ᱦᱚᱯᱚᱱ", "बच्चे"],
  ["ᱚᱲᱟᱜ", "घर"], ["ᱦᱚᱭ", "हाँ"], ["ᱵᱟᱝ", "नहीं"]
];

// ---------------------------------------------------------------------------
// IndicTrans2 backend (see server.py). Point this at wherever you run it.
// ---------------------------------------------------------------------------
const API_BASE_URL = "http://localhost:8000";
const API_TIMEOUT_MS = 8000;
const DEBOUNCE_MS = 500; // wait for a pause in typing before calling the model

let sourceLanguage = "hindi";
let history = [];
let debounceTimer = null;
let requestToken = 0; // guards against a slow response landing after newer input

const sourceText = document.querySelector("#sourceText");
const outputText = document.querySelector("#outputText");
const sourceLabel = document.querySelector("#sourceLabel");
const targetLabel = document.querySelector("#targetLabel");
const charCount = document.querySelector("#charCount");
const confidence = document.querySelector("#confidence");
const speakButton = document.querySelector("#speakButton");
const toast = document.querySelector("#toast");

function normalize(value) {
  return value.toLowerCase().replace(/[।！？!?.,،]/g, "").replace(/\s+/g, " ").trim();
}

function getPairForCurrentDirection() {
  return phrasePairs.map((pair) => sourceLanguage === "hindi"
    ? { source: pair.hindi, target: pair.santhali } : { source: pair.santhali, target: pair.hindi });
}

// Instant, fully offline dictionary lookup — same logic as before, just renamed.
function localTranslate(value) {
  const clean = normalize(value);
  if (!clean) return "";
  const pairs = getPairForCurrentDirection();
  const exact = pairs.find((pair) => normalize(pair.source) === clean);
  if (exact) return exact.target;
  const partial = pairs
    .filter((pair) => clean.includes(normalize(pair.source)) && normalize(pair.source).length > 1)
    .sort((a, b) => normalize(b.source).length - normalize(a.source).length);
  let result = value;
  if (partial.length) {
    partial.forEach((pair) => {
      result = result.replace(new RegExp(escapeRegExp(pair.source), "gi"), pair.target);
    });
    return result;
  }
  wordPairs.forEach(([left, right]) => {
    const from = sourceLanguage === "hindi" ? left : right;
    const to = sourceLanguage === "hindi" ? right : left;
    result = result.replace(new RegExp(escapeRegExp(from), "g"), to);
  });
  return result === value ? `⌁ ${value}` : result;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Real machine translation via the IndicTrans2 backend.
async function remoteTranslate(value, source, target, signal) {
  const response = await fetch(`${API_BASE_URL}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: value, source, target }),
    signal,
  });
  if (!response.ok) throw new Error(`API error ${response.status}`);
  const data = await response.json();
  return data.translation;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function renderResult(result) {
  outputText.innerHTML = result
    ? escapeHtml(result)
    : '<span class="output-placeholder">Your translation will appear here</span>';
  speakButton.disabled = !result;
}

function setStatus(state) {
  const labels = {
    empty: "Waiting for input",
    local: "Phrase match · local",
    loading: "Translating with IndicTrans2…",
    ai: "IndicTrans2 · AI translation",
    fallback: "Offline · local phrase match",
    unreachable: "Can't reach IndicTrans2 server",
  };
  confidence.classList.toggle("ready", state === "local" || state === "ai" || state === "fallback");
  confidence.innerHTML = `<i></i> ${labels[state] ?? labels.empty}`;
}

async function updateTranslation(addToHistory = true) {
  const value = sourceText.value.slice(0, 240);
  sourceText.value = value;
  charCount.textContent = `${value.length} / 240`;

  window.clearTimeout(debounceTimer);
  const token = ++requestToken;

  if (!value.trim()) {
    renderResult("");
    setStatus("empty");
    return;
  }

  // 1. Show the instant local match right away so the UI never feels stuck.
  const localResult = localTranslate(value);
  const hasLocalMatch = Boolean(localResult) && !localResult.startsWith("⌁");
  renderResult(hasLocalMatch ? localResult : "");
  setStatus(hasLocalMatch ? "local" : "loading");

  // 2. After a short pause in typing, ask the real model for a proper translation.
  debounceTimer = window.setTimeout(async () => {
    setStatus("loading");
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);
    try {
      const target = sourceLanguage === "hindi" ? "santali" : "hindi";
      const aiResult = await remoteTranslate(value, sourceLanguage, target, controller.signal);
      window.clearTimeout(timeoutId);
      if (token !== requestToken) return; // user kept typing; this response is stale
      renderResult(aiResult);
      setStatus("ai");
      if (addToHistory && aiResult) addHistory(value, aiResult);
    } catch (err) {
      window.clearTimeout(timeoutId);
      if (token !== requestToken) return;
      if (hasLocalMatch) {
        renderResult(localResult);
        setStatus("fallback");
        if (addToHistory) addHistory(value, localResult);
      } else {
        renderResult("");
        setStatus("unreachable");
      }
    }
  }, DEBOUNCE_MS);
}

function addHistory(source, target) {
  if (history[0]?.source === source && history[0]?.target === target) return;
  history.unshift({ source, target });
  history = history.slice(0, 4);
  renderHistory();
}

function renderHistory() {
  const list = document.querySelector("#historyList");
  if (!history.length) {
    list.innerHTML = '<div class="history-empty">Your offline translation history will appear here.</div>';
    return;
  }
  list.innerHTML = history.map((item) => `
    <button class="history-item" type="button" data-history-source="${escapeHtml(item.source)}">
      <span class="history-icon">Aa</span>
      <span><b>${escapeHtml(item.source)}</b><small>${escapeHtml(item.target)}</small></span>
      <time>Just now</time>
    </button>`).join("");
  list.querySelectorAll("[data-history-source]").forEach((button) => {
    button.addEventListener("click", () => {
      sourceText.value = button.dataset.historySource;
      updateTranslation(false);
    });
  });
}

function updateLanguageUI() {
  const isHindi = sourceLanguage === "hindi";
  sourceLabel.textContent = isHindi ? "Hindi · हिन्दी" : "Santhali · ᱥᱟᱱᱛᱟᱲᱤ";
  targetLabel.textContent = isHindi ? "Santhali · ᱥᱟᱱᱛᱟᱲᱤ" : "Hindi · हिन्दी";
  document.querySelectorAll(".language-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.source === sourceLanguage);
  });
  if (sourceText.value) updateTranslation(false);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2300);
}

sourceText.addEventListener("input", () => updateTranslation(false));
sourceText.addEventListener("blur", () => {
  if (sourceText.value.trim()) updateTranslation(true);
});
document.querySelectorAll(".language-tab").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.source === sourceLanguage) return;
    sourceLanguage = button.dataset.source;
    updateLanguageUI();
  });
});
document.querySelector("#swapButton").addEventListener("click", () => {
  const currentOutput = outputText.textContent;
  sourceLanguage = sourceLanguage === "hindi" ? "santhali" : "hindi";
  sourceText.value = currentOutput.startsWith("Your translation") ? "" : currentOutput;
  updateLanguageUI();
  showToast("Languages swapped");
});
document.querySelector("#clearButton").addEventListener("click", () => {
  sourceText.value = "";
  updateTranslation(false);
  sourceText.focus();
});
document.querySelectorAll("[data-example]").forEach((button) => {
  button.addEventListener("click", () => {
    sourceText.value = button.dataset.example;
    updateTranslation();
  });
});
document.querySelector("#copyButton").addEventListener("click", async () => {
  const value = outputText.textContent;
  if (!value || value.includes("Your translation")) return showToast("Translate something first");
  try { await navigator.clipboard.writeText(value); showToast("Translation copied"); }
  catch { showToast("Copy is not available here"); }
});
document.querySelector("#speakButton").addEventListener("click", () => {
  const value = outputText.textContent;
  if (!value || !window.speechSynthesis) return showToast("Speech playback is not supported in this browser");
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(value);
  utterance.lang = sourceLanguage === "hindi" ? "sat" : "hi-IN";
  window.speechSynthesis.speak(utterance);
});
document.querySelector("#micButton").addEventListener("click", async () => {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) return showToast("Voice input needs a browser with speech recognition (try Chrome or Edge)");

  // Ask for the mic explicitly first, so a blocked permission says so clearly
  // instead of speech recognition just silently doing nothing.
  if (navigator.mediaDevices?.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      return showToast(
        err?.name === "NotFoundError"
          ? "No microphone found on this device"
          : "Microphone is blocked — allow it in your browser's site settings"
      );
    }
  }

  const recognition = new Recognition();
  recognition.lang = sourceLanguage === "hindi" ? "hi-IN" : "sat";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onstart = () => showToast("Listening… speak a classroom phrase");
  recognition.onresult = (event) => {
    sourceText.value = event.results[0][0].transcript;
    updateTranslation();
  };
  recognition.onerror = (event) => {
    const messages = {
      "not-allowed": "Microphone is blocked — allow it in your browser's site settings",
      "service-not-allowed": "Microphone is blocked — allow it in your browser's site settings",
      "no-speech": "Didn't catch that — try speaking again",
      "audio-capture": "No microphone found on this device",
      network: "Voice recognition needs an internet connection",
      aborted: "",
    };
    const message = messages[event.error] ?? "I couldn't hear that. Try again.";
    if (message) showToast(message);
  };
  try {
    recognition.start();
  } catch {
    showToast("Voice input couldn't start — try again");
  }
});
document.querySelector("#clearHistoryButton").addEventListener("click", () => {
  history = [];
  renderHistory();
  showToast("Local history cleared");
});
const aboutDialog = document.querySelector("#aboutDialog");
document.querySelector("#helpButton").addEventListener("click", () => aboutDialog.showModal());
document.querySelector("#dialogClose").addEventListener("click", () => aboutDialog.close());
const worksheetDialog = document.querySelector("#worksheetDialog");
document.querySelector("#worksheetButton").addEventListener("click", () => worksheetDialog.showModal());
document.querySelector("#worksheetClose").addEventListener("click", () => worksheetDialog.close());
document.querySelector("#printButton").addEventListener("click", () => {
  showToast("Print preview is ready in the full PALASH app");
  worksheetDialog.close();
});
document.querySelectorAll("dialog").forEach((dialog) => dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
}));

// Let the teacher know up front whether the AI backend is actually reachable.
(async function checkBackend() {
  try {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    window.clearTimeout(timeoutId);
    if (!res.ok) throw new Error();
    showToast("Connected to IndicTrans2");
  } catch {
    showToast("IndicTrans2 server not found — using local phrases only");
  }
})();
