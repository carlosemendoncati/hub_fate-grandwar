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
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Dados salvos no MongoDB!');
            return true;
        } else {
            console.warn('⚠️ Problema ao salvar no servidor');
            return false;
        }
    } catch (error) {
        console.warn('🌐 Servidor offline, salvando apenas localmente');
        return false;
    }
}

// Função para carregar do backend
async function loadFromBackend(playerCode) {
    try {
        const response = await fetch(`${API_BASE}/get-player?code=${playerCode}`);
        const result = await response.json();
        
        if (result.success && result.data) {
            console.log('✅ Dados carregados do MongoDB!');
            return result.data;
        }
    } catch (error) {
        console.warn('🌐 Servidor offline, carregando do localStorage');
    }
    
    return null;
}

// Função para testar conexão com o backend
async function testBackendConnection() {
    try {
        const response = await fetch(`${API_BASE}/get-player?code=FG-8V501Y`);
        if (response.ok) {
            console.log('✅ Backend conectado!');
            return true;
        }
    } catch (error) {
        console.warn('❌ Backend offline:', error.message);
    }
    return false;
}

// Exportar para uso em outros arquivos
window.authSystem = {
    saveToBackend,
    loadFromBackend,
    testBackendConnection,
    playerDatabase
};
