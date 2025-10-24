// auth.js - Versão final com integração MongoDB
const CONFIG = {
  API_BASE: window.location.hostname !== 'localhost' ? '/api' : 'https://seu-projeto.vercel.app/api',
  DEBOUNCE_DELAY: 500
};

const playerDatabase = {
  'FG-8V501Y': { /* dados como antes */ },
  'FG-TEST01': { /* dados como antes */ }
};

const logger = { info: (msg) => console.log(`🔐 ${msg}`), warn: (msg) => console.warn(`⚠️ ${msg}`), error: (msg) => console.error(`❌ ${msg}`), success: (msg) => console.log(`✅ ${msg}`) };

function sanitizeInput(input) { return input ? input.trim().replace(/[<>]/g, '') : ''; }
function isValidPlayerCode(code) { const c = sanitizeInput(code).toUpperCase(); return /^FG-[A-Z0-9]{5,}$/.test(c) && playerDatabase.hasOwnProperty(c); }

async function saveToBackend(playerData, playerCode) {
  try {
    const response = await fetch(`${CONFIG.API_BASE}/save-player`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ playerCode, playerData }) });
    return response.ok ? true : false;
  } catch { return false; }
}

async function loadFromBackend(playerCode) {
  try {
    const response = await fetch(`${CONFIG.API_BASE}/get-player?code=${encodeURIComponent(playerCode)}`);
    const result = await response.json();
    return result.success ? result.data : null;
  } catch { return null; }
}

async function authenticate(code) {
  const c = sanitizeInput(code).toUpperCase();
  if (!isValidPlayerCode(c)) return null;
  const player = { ...playerDatabase[c] };
  const saved = await loadFromBackend(c);
  if (saved) Object.assign(player, saved);
  return { player, quests: JSON.parse(localStorage.getItem(`quests_${c}`) || '[]') };
}

window.authSystem = { authenticate, saveToBackend, loadFromBackend, isValidPlayerCode, logger };
logger.info('Sistema de autenticação carregado');
