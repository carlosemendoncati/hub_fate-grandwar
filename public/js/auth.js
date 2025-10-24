// Configurações da API
// Para produção (Vercel), use caminho relativo. Para desenvolvimento local, use URL absoluta.
const IS_PRODUCTION = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const API_BASE = IS_PRODUCTION ? '/api' : 'https://seu-projeto.vercel.app/api';  // Substitua 'seu-projeto.vercel.app' pela URL real do Vercel

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

// Matrix Rain Effect
function createMatrixRain() {
    const matrixRain = document.getElementById('matrixRain');
    if (matrixRain) {
        for (let i = 0; i < 50; i++) {
            const span = document.createElement('span');
            span.innerText = Math.random() > 0.5 ? '1' : '0';
            span.style.left = Math.random() * 100 + '%';
            span.style.animationDelay = Math.random() * 5 + 's';
            matrixRain.appendChild(span);
        }
    }
}

// Função para inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginScreen = document.getElementById('login-screen');
    const dashboard = document.getElementById('dashboard');
    const codeInput = document.getElementById('code-input');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userGreeting = document.getElementById('user-greeting');
    const userCode = document.getElementById('user-code');
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.content-panel');

    // Profile Edit Elements
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const profileEditButtons = document.getElementById('profile-edit-buttons');

    // Quest Elements
    const addQuestBtn = document.getElementById('add-quest-btn');
    const questTitleInput = document.getElementById('quest-title');
    const questDescriptionInput = document.getElementById('quest-description');
    const questList = document.getElementById('quest-list');

    // Login Function
    async function login() {
        const code = codeInput.value.trim().toUpperCase();
        const playerDatabase = window.authSystem.playerDatabase;
        
        if (playerDatabase[code]) {
            const player = playerDatabase[code];
            
            // Tenta carregar do backend primeiro
            const savedData = await window.authSystem.loadFromBackend(code);
            if (savedData) {
                Object.assign(player, savedData);
            } else {
                // Fallback para localStorage
                const localData = localStorage.getItem(`playerData_${code}`);
                if (localData) {
                    Object.assign(player, JSON.parse(localData));
                }
            }
            
            // Load quests from localStorage
            const savedQuests = localStorage.getItem(`quests_${code}`);
            if (savedQuests) {
                displayQuests(JSON.parse(savedQuests));
            }
            
            // Update UI with player data
            updateProfileDisplay(player);
            
            userGreeting.textContent = `BEM-VINDO, ${player.name}`;
            userCode.textContent = `CÓDIGO: ${code}`;
            
            // Switch to dashboard
            loginScreen.style.display = 'none';
            dashboard.style.display = 'flex';
            
            // Store current user in session
            sessionStorage.setItem('currentUser', code);
        } else {
            alert('CÓDIGO DE ACESSO INVÁLIDO. TENTE NOVAMENTE.');
            codeInput.value = '';
            codeInput.focus();
        }
    }

    // Update profile display
    function updateProfileDisplay(player) {
        document.getElementById('profile-name').textContent = player.name;
        document.getElementById('profile-origin').textContent = player.origin;
        document.getElementById('profile-type').textContent = player.profile;
        document.getElementById('profile-nature').textContent = player.nature;
        document.getElementById('profile-motivation').textContent = player.motivation;
        document.getElementById('servant-class').textContent = player.servant.class;
        document.getElementById('servant-name').textContent = player.servant.name;
        document.getElementById('servant-alignment').textContent = player.servant.alignment;
        document.getElementById('servant-bond').textContent = player.servant.bond;
    }

    // Logout Function
    function logout() {
        sessionStorage.removeItem('currentUser');
        dashboard.style.display = 'none';
        loginScreen.style.display = 'flex';
        codeInput.value = '';
        codeInput.focus();
    }

    // Tab Switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and panels
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(`${tabId}-panel`).classList.add('active');
        });
    });

    // Profile Edit Functions
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            const currentUser = sessionStorage.getItem('currentUser');
            const player = window.authSystem.playerDatabase[currentUser];
            
            // Show edit inputs with current values
            document.getElementById('edit-profile-name').value = player.name;
            document.getElementById('edit-profile-origin').value = player.origin;
            document.getElementById('edit-profile-type').value = player.profile;
            document.getElementById('edit-profile-nature').value = player.nature;
            document.getElementById('edit-profile-motivation').value = player.motivation;
            
            // Hide display values, show inputs
            document.querySelectorAll('.profile-value').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.edit-input').forEach(el => el.style.display = 'block');
            
            // Show edit buttons
            profileEditButtons.style.display = 'flex';
            editProfileBtn.style.display = 'none';
        });
    }

    // Save Profile Function
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', async () => {
            const currentUser = sessionStorage.getItem('currentUser');
            const player = window.authSystem.playerDatabase[currentUser];
            
            // Update player data with edited values
            player.name = document.getElementById('edit-profile-name').value;
            player.origin = document.getElementById('edit-profile-origin').value;
            player.profile = document.getElementById('edit-profile-type').value;
            player.nature = document.getElementById('edit-profile-nature').value;
            player.motivation = document.getElementById('edit-profile-motivation').value;
            
            // Dados completos para salvar
            const playerDataToSave = {
                name: player.name,
                origin: player.origin,
                profile: player.profile,
                nature: player.nature,
                motivation: player.motivation,
                servant: player.servant
            };
            
            // SALVA NO BACKEND E NO LOCALSTORAGE
            const backendSuccess = await window.authSystem.saveToBackend(playerDataToSave);
            
            // Sempre salva localmente como backup
            localStorage.setItem(`playerData_${currentUser}`, JSON.stringify(playerDataToSave));
            
            if (backendSuccess) {
                alert('✅ Dados salvos no servidor!');
            } else {
                alert('⚠️ Dados salvos localmente (servidor offline)');
            }
            
            // Update display
            updateProfileDisplay(player);
            
            // Hide inputs, show display values
            document.querySelectorAll('.profile-value').forEach(el => el.style.display = 'block');
            document.querySelectorAll('.edit-input').forEach(el => el.style.display = 'none');
            
            // Hide edit buttons, show edit profile button
            profileEditButtons.style.display = 'none';
            editProfileBtn.style.display = 'block';
            
            // Update greeting
            userGreeting.textContent = `BEM-VINDO, ${player.name}`;
        });
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => {
            // Hide inputs, show display values
            document.querySelectorAll('.profile-value').forEach(el => el.style.display = 'block');
            document.querySelectorAll('.edit-input').forEach(el => el.style.display = 'none');
            
            // Hide edit buttons, show edit profile button
            profileEditButtons.style.display = 'none';
            editProfileBtn.style.display = 'block';
        });
    }

    // Quest Functions
    function addQuest() {
        const title = questTitleInput.value.trim();
        const description = questDescriptionInput.value.trim();
        
        if (!title) {
            alert('Por favor, insira um título para a missão.');
            return;
        }
        
        const currentUser = sessionStorage.getItem('currentUser');
        const quests = JSON.parse(localStorage.getItem(`quests_${currentUser}`)) || [];
        
        const newQuest = {
            id: Date.now(),
            title: title,
            description: description,
            status: 'active',
            createdAt: new Date().toLocaleDateString('pt-BR')
        };
        
        quests.push(newQuest);
        localStorage.setItem(`quests_${currentUser}`, JSON.stringify(quests));
        
        displayQuests(quests);
        
        // Clear form
        questTitleInput.value = '';
        questDescriptionInput.value = '';
    }

    function displayQuests(quests) {
        questList.innerHTML = '';
        
        if (quests.length === 0) {
            questList.innerHTML = '<div class="profile-item">Nenhuma missão criada ainda.</div>';
            return;
        }
        
        quests.forEach(quest => {
            const questItem = document.createElement('div');
            questItem.className = 'quest-item';
            questItem.innerHTML = `
                <div class="quest-header">
                    <div class="quest-title">${quest.title}</div>
                    <div class="quest-status ${quest.status === 'active' ? 'status-active' : 'status-completed'}">
                        ${quest.status === 'active' ? 'ATIVA' : 'CONCLUÍDA'}
                    </div>
                </div>
                <div class="quest-description">${quest.description}</div>
                <div class="profile-label">Criada em: ${quest.createdAt}</div>
                <div class="quest-actions">
                    <button class="btn
