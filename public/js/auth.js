// Configurações da API
const API_BASE = '/api';

// Banco de dados de jogadores (inicial)
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

// Função para salvar no backend
async function saveToBackend(playerData) {
    const playerCode = sessionStorage.getItem('currentUser');
    
    if (!playerCode) {
        console.error('❌ Nenhum usuário logado para salvar dados');
        return false;
    }
    
    try {
        const response = await fetch(`${API_BASE}/save-player`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                playerCode: playerCode,
                playerData: playerData
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Dados salvos no MongoDB!');
            return true;
        } else {
            console.warn('⚠️ Problema ao salvar no servidor:', result.error);
            return false;
        }
    } catch (error) {
        console.warn('🌐 Servidor offline, salvando apenas localmente:', error.message);
        return false;
    }
}

// Função para carregar do backend
async function loadFromBackend(playerCode) {
    if (!playerCode) {
        console.error('❌ Código do jogador não fornecido');
        return null;
    }
    
    try {
        const response = await fetch(`${API_BASE}/get-player?code=${encodeURIComponent(playerCode)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
            console.log('✅ Dados carregados do MongoDB!');
            return result.data;
        } else {
            console.log('ℹ️ Jogador não encontrado no servidor');
            return null;
        }
    } catch (error) {
        console.warn('🌐 Servidor offline, carregando do localStorage:', error.message);
        return null;
    }
}

// Função para testar conexão com o backend
async function testBackendConnection() {
    try {
        const response = await fetch(`${API_BASE}/get-player?code=FG-8V501Y`);
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Backend conectado!');
            return true;
        } else {
            console.warn('❌ Backend respondeu com erro:', response.status);
            return false;
        }
    } catch (error) {
        console.warn('❌ Backend offline:', error.message);
        return false;
    }
}

// Função para verificar se um código é válido
function isValidPlayerCode(code) {
    if (!code || typeof code !== 'string') return false;
    
    const normalizedCode = code.trim().toUpperCase();
    return playerDatabase.hasOwnProperty(normalizedCode);
}

// Função para obter dados do jogador
function getPlayerData(code) {
    if (!isValidPlayerCode(code)) return null;
    
    const normalizedCode = code.trim().toUpperCase();
    return playerDatabase[normalizedCode];
}

// Sistema de logging melhorado
const logger = {
    info: (message) => console.log(`🔐 ${message}`),
    warn: (message) => console.warn(`⚠️ ${message}`),
    error: (message) => console.error(`❌ ${message}`),
    success: (message) => console.log(`✅ ${message}`)
};

// Exportar para uso em outros arquivos
window.authSystem = {
    saveToBackend,
    loadFromBackend,
    testBackendConnection,
    isValidPlayerCode,
    getPlayerData,
    playerDatabase,
    logger
};

// Inicialização
console.log('🔐 Sistema de autenticação carregado!');
console.log(`📋 Jogadores disponíveis: ${Object.keys(playerDatabase).join(', ')}`);

// Teste automático da conexão quando o arquivo carrega
window.addEventListener('load', async () => {
    console.log('🔍 Testando conexão com o backend...');
    await testBackendConnection();
});
