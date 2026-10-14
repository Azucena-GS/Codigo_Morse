import '../css/styles.css';

const MORSE_CODE = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
  I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
  Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..',
  0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....',
  6: '-....', 7: '--...', 8: '---..', 9: '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', _: '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
};

const REVERSE_MORSE = Object.fromEntries(
  Object.entries(MORSE_CODE).map(([character, code]) => [code, character])
);

const elements = {
  source: document.querySelector('#source-text'),
  result: document.querySelector('#result-text'),
  sourceLabel: document.querySelector('#source-label'),
  resultLabel: document.querySelector('#result-label'),
  inputHint: document.querySelector('#input-hint'),
  outputHint: document.querySelector('#output-hint'),
  count: document.querySelector('#char-count'),
  error: document.querySelector('#error-message'),
  convertLabel: document.querySelector('#convert-label'),
  copy: document.querySelector('#copy-button'),
  clear: document.querySelector('#clear-button'),
  modeIndex: document.querySelector('#mode-index'),
  modes: [...document.querySelectorAll('.mode-button')]
};

let currentMode = 'text-to-morse';

function normalizeText(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/¡/g, '!').replace(/¿/g, '?').toUpperCase();
}

function encodeText(text) {
  const normalized = normalizeText(text);
  const unsupported = [...new Set([...normalized].filter((character) => character !== ' ' && !Object.hasOwn(MORSE_CODE, character)))];

  if (unsupported.length) {
    throw new Error(`Carácter${unsupported.length > 1 ? 'es' : ''} no admitido${unsupported.length > 1 ? 's' : ''}: ${unsupported.join(' ')}.`);
  }

  return normalized.trim().split(/\s+/).filter(Boolean)
    .map((word) => [...word].map((character) => MORSE_CODE[character]).join(' '))
    .join(' / ');
}

function decodeMorse(morse) {
  const normalized = morse.trim().replace(/[·•]/g, '.').replace(/[−–—]/g, '-');
  const invalidCharacters = normalized.match(/[^.\-/\s]/g);
  if (invalidCharacters) throw new Error('Usa solo puntos (.), rayas (-), espacios y / para separar palabras.');

  const words = normalized.split(/\s*\/\s*/);
  if (words.some((word) => !word.trim())) throw new Error('Separa las palabras con / y no dejes palabras vacías.');

  const unknownCode = words.flatMap((word) => word.trim().split(/\s+/))
    .find((code) => code && !Object.hasOwn(REVERSE_MORSE, code));
  if (unknownCode) throw new Error(`La secuencia «${unknownCode}» no corresponde a una letra o signo conocido.`);

  return words.map((word) => word.trim().split(/\s+/).filter(Boolean)
    .map((code) => REVERSE_MORSE[code]).join('')).join(' ');
}

function updateCount() {
  elements.count.textContent = `${elements.source.value.length} / ${elements.source.maxLength}`;
}

function clearError() {
  elements.error.textContent = '';
  elements.source.removeAttribute('aria-invalid');
}

function setMode(mode) {
  currentMode = mode;
  const textToMorse = mode === 'text-to-morse';
  elements.modes.forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  elements.sourceLabel.textContent = textToMorse ? 'Texto de entrada' : 'Código Morse de entrada';
  elements.resultLabel.textContent = textToMorse ? 'Resultado en Morse' : 'Texto descifrado';
  elements.source.placeholder = textToMorse ? 'Escribe un texto…' : 'Ej. .... --- .-.. .- / -- ..- -. -.. ---';
  elements.inputHint.textContent = textToMorse ? 'Letras, números y signos comunes' : 'Puntos, rayas, espacios y / para separar palabras';
  elements.outputHint.textContent = textToMorse ? 'Separa letras con espacios y palabras con /' : 'El mensaje descifrado aparece en mayúsculas';
  elements.convertLabel.textContent = textToMorse ? 'Convertir a Morse' : 'Descifrar mensaje';
  elements.modeIndex.textContent = textToMorse ? 'Modo 1 de 2' : 'Modo 2 de 2';
  elements.source.maxLength = textToMorse ? '500' : '1500';
  elements.source.value = '';
  elements.result.value = '';
  elements.copy.disabled = true;
  clearError();
  updateCount();
}

function convert() {
  const input = elements.source.value.trim();
  clearError();

  if (!input) {
    elements.result.value = '';
    elements.copy.disabled = true;
    elements.error.textContent = 'Escribe un mensaje antes de convertir.';
    elements.source.setAttribute('aria-invalid', 'true');
    elements.source.focus();
    return;
  }

  try {
    elements.result.value = currentMode === 'text-to-morse' ? encodeText(input) : decodeMorse(input);
    elements.copy.disabled = !elements.result.value;
  } catch (error) {
    elements.result.value = '';
    elements.copy.disabled = true;
    elements.error.textContent = error.message;
    elements.source.setAttribute('aria-invalid', 'true');
  }
}

elements.modes.forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode)));
document.querySelector('#convert-button').addEventListener('click', convert);
elements.source.addEventListener('input', () => {
  updateCount();
  clearError();
  elements.result.value = '';
  elements.copy.disabled = true;
});
elements.source.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') convert();
});
elements.clear.addEventListener('click', () => {
  elements.source.value = '';
  elements.result.value = '';
  elements.copy.disabled = true;
  clearError();
  updateCount();
  elements.source.focus();
});
elements.copy.addEventListener('click', async () => {
  if (!elements.result.value) return;
  try {
    await navigator.clipboard.writeText(elements.result.value);
    elements.copy.textContent = 'Copiado';
    window.setTimeout(() => { elements.copy.textContent = 'Copiar'; }, 1400);
  } catch {
    elements.error.textContent = 'No se pudo copiar. Selecciona el resultado para copiarlo manualmente.';
  }
});