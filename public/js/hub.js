// hub.js - Funcionalidades do Dashboard do Hub de Personagem
// Melhorado para UX, acessibilidade e performance

// ===== DEPENDÊNCIAS =====
// Depende de auth.js para window.authSystem

// ===== EFEITOS E UTILITÁRIOS =====
// Matrix Rain Effect (otimizado)
function createMatrixRain() {
    const matrixRain = document.getElementById('matrixRain');
    if (!matrixRain) return;

    // Limite para performance em dispositivos móveis
    const numDrops = window.innerWidth < 768 ? 20 : 50;
    for (let i = 0; i < numDrops; i++) {
        const span = document.createElement('span');
        span.innerText = Math.random() > 0.5 ? '1' : '0';
        span.style.left = Math.random() * 100 + '%';
        span.style.animationDelay = Math.random() * 5 + 's';
        matrixRain.appendChild(span);
    }
}

// Anúncio para leitores de tela
function announceToScreenReader(message) {
    const announcer = document.getElementById('aria-announcer');
    if (announcer) {
        announcer.textContent = message;
    }
}

// Estados de loading
function setLoading(element, isLoading) {
    if (isLoading) {
        element.classList.add('loading');
        element.disabled = true;
    } else {
        element.classList.remove('loading');
        element.disabled = false;
    }
}

// ===== FUNÇÕES PRINCIPAIS =====
// Atualizar display do perfil
function updateProfileDisplay(player) {
    if (!player) return;
    document.getElementById('profile-name').textContent = player.name || '---';
    document.getElementById('profile-origin').textContent = player.origin || '---';
    document.getElementById('profile-type').textContent = player.profile || '---';
    document.getElementById('profile-nature').textContent = player.nature || '---';
    document.getElementById('profile-motivation').textContent = player.motivation || '---';
    document.getElementById('servant-class').textContent = player.servant?.class || '---';
    document.getElementById('servant-name').textContent = player.servant?.name || 'CLASSIFICADO';
    document.getElementById('servant-alignment').textContent = player.servant?.alignment || '---';
    document.getElementById('servant-bond').textContent = player.servant?.bond || 'INICIAL';
    announceToScreenReader('Perfil atualizado');
}

// Login (chama auth.js)
async function login() {
    const codeInput = document.getElementById('code-input');
    const code = codeInput.value.trim();
    const loginBtn = document.getElementById('login-btn');

    setLoading(loginBtn, true);
    const result = await window.authSystem.authenticate(code);
    setLoading(loginBtn, false);

    if (!result) return;

    const { player, quests } = result;
    updateProfileDisplay(player);
    displayQuests(quests);

    // Atualizar UI
    document.getElementById('user-greeting').textContent = `BEM-VINDO, ${player.name}`;
    document.getElementById('user-code').textContent = `CÓDIGO: ${code}`;
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    announceToScreenReader(`Logado como ${player.name}`);
}

// Logout
function logout() {
    sessionStorage.removeItem('currentUser');
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('code-input').value = '';
    document.getElementById('code-input').focus();
    announceToScreenReader('Deslogado');
}

// Edição de perfil
function enableProfileEdit() {
    const currentUser = sessionStorage.getItem('currentUser');
    const player = window.authSystem.getPlayerData(currentUser);
    if (!player) return;

    // Preencher inputs
    document.getElementById('edit-profile-name').value = player.name;
    document.getElementById('edit-profile-origin').value = player.origin;
    document.getElementById('edit-profile-type').value = player.profile;
    document.getElementById('edit-profile-nature').value = player.nature;
    document.getElementById('edit-profile-motivation').value = player.motivation;

    // Alternar visibilidade
    document.querySelectorAll('.profile-value').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.edit-input').forEach(el => el.style.display = 'block');
    document.getElementById('profile-edit-buttons').style.display = 'flex';
    document.getElementById('edit-profile-btn').style.display = 'none';
}

async function saveProfile() {
    const saveBtn = document.getElementById('save-profile-btn');
    setLoading(saveBtn, true);

    const currentUser = sessionStorage.getItem('currentUser');
    const player = window.authSystem.playerDatabase[currentUser];
    if (!player) return;

    // Atualizar dados
    player.name = document.getElementById('edit-profile-name').value;
    player.origin = document.getElementById('edit-profile-origin').value;
    player.profile = document.getElementById('edit-profile-type').value;
    player.nature = document.getElementById('edit-profile-nature').value;
    player.motivation = document.getElementById('edit-profile-motivation').value;

    const playerData = {
        name: player.name,
        origin: player.origin,
        profile: player.profile,
        nature: player.nature,
        motivation: player.motivation,
        servant: player.servant
    };

    // Salvar
    const backendSuccess = await window.authSystem.saveToBackend(playerData, currentUser);
    localStorage.setItem(`playerData_${currentUser}`, JSON.stringify(playerData));

    setLoading(saveBtn, false);
    window.authSystem.showFeedback('profile-feedback', backendSuccess ? 'Dados salvos no servidor!' : 'Dados salvos localmente.', backendSuccess ? 'success' : 'error');

    // Atualizar UI
    updateProfileDisplay(player);
    document.querySelectorAll('.profile-value').forEach(el => el.style.display = 'block');
    document.querySelectorAll('.edit-input').forEach(el => el.style.display = 'none');
    document.getElementById('profile-edit-buttons').style.display = 'none';
    document.getElementById('edit-profile-btn').style.display = 'block';
    document.getElementById('user-greeting').textContent = `BEM-VINDO, ${player.name}`;
}

function cancelProfileEdit() {
    document.querySelectorAll('.profile-value').forEach(el => el.style.display = 'block');
    document.querySelectorAll('.edit-input').forEach(el => el.style.display = 'none');
    document.getElementById('profile-edit-buttons').style.display = 'none';
    document.getElementById('edit-profile-btn').style.display = 'block';
}

// Sistema de missões
function addQuest() {
    const title = document.getElementById('quest-title').value.trim();
    const description = document.getElementById('quest-description').value.trim();

    if (!title) {
        window.authSystem.showFeedback('quest-feedback', 'Insira um título para a missão.');
        return;
    }

    const currentUser = sessionStorage.getItem('currentUser');
    const quests = JSON.parse(localStorage.getItem(`quests_${currentUser}`) || '[]');
    const newQuest = {
        id: Date.now(),
        title,
        description,
        status: 'active',
        createdAt: new Date().toLocaleDateString('pt-BR')
    };

    quests.push(newQuest);
    localStorage.setItem(`quests_${currentUser}`, JSON.stringify(quests));
    displayQuests(quests);

    // Limpar form
    document.getElementById('quest-title').value = '';
    document.getElementById('quest-description').value = '';
    announceToScreenReader('Missão adicionada');
}

function displayQuests(quests) {
    const questList = document.getElementById('quest-list');
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
                <button class="btn btn-small toggle-quest-btn" data-id="${quest.id}" aria-label="Alternar status da
