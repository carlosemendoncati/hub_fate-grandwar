// auth.js - Sistema de Autenticação e Comunicação com Backend
// Melhorado para segurança, performance e UX

// ===== CONFIGURAÇÕES =====
const CONFIG = {
    API_BASE: (() => {
        const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        return isProduction ? '/api' : 'https://seu-projeto.vercel.app/api'; // Substitua pela URL real do Vercel
    })(),
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // ms
    DEBOUNCE_DELAY: 500, // ms para saves
};

// ===== BANCO DE DADOS LOCAL (FALLBACK) =====
const playerDatabase = {
    'FG-8V501Y': {
        name: 'KADU',
        origin: 'KUROGANE',
        profile: 'ADULTO',
        nature: 'MAGO',
        motivation: 'SALVAR ALGUÉM QUE PERDI',
        servant: {
            class: 'SABER',
            name: 'CLASSIFICADO',
            alignment: 'LEAL E BOM',
            bond: 'INICIAL'
        }
    },
    'FG-TEST01': {
        name: 'JOGADOR TESTE',
        origin: 'EXTERNA',
        profile: 'ESTUDANTE',
        nature: 'HUMANO COMUM',
        motivation: 'MUDAR O MUNDO',
        servant: {
            class: 'ARCHER',
            name: 'CLASSIFICADO',
            alignment: 'NEUTRO',
            bond: 'INICIAL'
        }
    }
};

// ===== UTILITÁRIOS =====
const logger = {
    info: (message) => console.log(`🔐 ${message}`),
    warn: (message) => console.warn(`⚠️ ${message}`),
    error: (message) => console.error(`❌ ${message}`),
    success: (message) => console.log(`✅ ${message}`)
};

// Sanitização básica de entrada (prevenção XSS)
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.trim().replace(/[<>]/g, ''); // Remove tags HTML básicas
}

// Validação de código de jogador
function isValidPlayerCode(code) {
    if (!code || typeof code !== 'string') return false;
    const sanitized = sanitizeInput(code).toUpperCase();
    return /^FG-[A-Z0-9]{5,}$/.test(sanitized) && playerDatabase.hasOwnProperty(sanitized);
}

// Debounce para operações frequentes (ex.: saves)
function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
}

// ===== FUNÇÕES DE BACKEND =====
// Salvar no backend com retry e tratamento de erros
async function saveToBackend(playerData, playerCode, retries = CONFIG.MAX_RETRIES) {
    if (!playerCode || !playerData) {
        logger.error('Dados ou código do jogador inválidos para salvar');
        return false;
    }

    try {
        const response = await fetch(`${CONFIG.API_BASE}/save-player`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerCode, playerData })
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
            logger.success('Dados salvos no MongoDB');
            return true;
        } else {
            logger.warn('Falha ao salvar no servidor:', result.error);
            return false;
        }
    } catch (error) {
        logger.warn(`Tentativa ${CONFIG.MAX_RETRIES - retries + 1} falhou: ${error.message}`);
        if (retries > 1) {
            await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
            return saveToBackend(playerData, playerCode, retries - 1);
        }
        logger.error('Servidor offline, salvando apenas localmente');
        return false;
    }
}

// Carregar do backend
async function loadFromBackend(playerCode) {
    if (!playerCode) {
        logger.error('Código do jogador não fornecido');
        return null;
    }

    try {
        const response = await fetch(`${CONFIG.API_BASE}/get-player?code=${encodeURIComponent(playerCode)}`);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

        const result = await response.json();
        if (result.success && result.data) {
            logger.success('Dados carregados do MongoDB');
            return result.data;
        }
        logger.info('Jogador não encontrado no servidor');
        return null;
    } catch (error) {
        logger.warn(`Servidor offline: ${error.message}`);
        return null;
    }
}

// Testar conexão com backend
async function testBackendConnection() {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/status`); // Assumindo endpoint /status
        if (response.ok) {
            logger.success('Backend conectado');
            return true;
        }
        logger.warn('Backend respondeu com erro');
        return false;
    } catch (error) {
        logger.error(`Backend offline: ${error.message}`);
        return false;
    }
}

// ===== FUNÇÕES DE AUTENTICAÇÃO =====
// Obter dados do jogador (com validação)
function getPlayerData(code) {
    if (!isValidPlayerCode(code)) return null;
    const normalizedCode = sanitizeInput(code).toUpperCase();
    return { ...playerDatabase[normalizedCode] }; // Clone para evitar mutação
}

// Função de login (movida para cá para evitar duplicação; hub.js chama essa)
async function authenticate(code) {
    const sanitizedCode = sanitizeInput(code).toUpperCase();
    if (!isValidPlayerCode(sanitizedCode)) {
        showFeedback('login-feedback', 'Código inválido. Use formato FG-XXXXX.');
        return false;
    }

    const player = getPlayerData(sanitizedCode);
    if (!player) {
        showFeedback('login-feedback', 'Código não encontrado.');
        return false;
    }

    // Carregar dados salvos
    const savedData = await loadFromBackend(sanitizedCode) || JSON.parse(localStorage.getItem(`playerData_${sanitizedCode}`) || '{}');
    Object.assign(player, savedData);

    // Carregar missões
    const savedQuests = JSON.parse(localStorage.getItem(`quests_${sanitizedCode}`) || '[]');

    sessionStorage.setItem('currentUser', sanitizedCode);
    logger.success(`Usuário ${player.name} autenticado`);
    return { player, quests: savedQuests };
}

// Função auxiliar para feedback (integra com HTML)
function showFeedback(elementId, message, type = 'error') {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.className = type;
    el.style.display = 'block';
    el.setAttribute('aria-live', 'assertive'); // Anúncio para leitores de tela
    setTimeout(() => {
        el.style.display = 'none';
        el.setAttribute('aria-live', 'off');
    }, 5000);
}

// ===== INICIALIZAÇÃO =====
window.authSystem = {
    authenticate,
    saveToBackend: debounce(saveToBackend, CONFIG.DEBOUNCE_DELAY), // Debounced para performance
    loadFromBackend,
    testBackendConnection,
    isValidPlayerCode,
    getPlayerData,
    playerDatabase,
    logger,
    showFeedback
};

logger.info('Sistema de autenticação carregado');
logger.info(`Jogadores disponíveis: ${Object.keys(playerDatabase).join(', ')}`);

// Inicialização automática
window.addEventListener('load', async () => {
    logger.info('Testando conexão com backend...');
    await testBackendConnection();
});
