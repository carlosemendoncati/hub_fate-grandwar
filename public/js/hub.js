// hub.js - Funcionalidades do Dashboard do Hub de Personagem
// Depende de auth.js para window.authSystem

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

// Função para inicializar o hub quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Hub de Personagem inicializado!');

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

    // Login Function (integra com auth.js)
    async function login() {
        const code = codeInput.value.trim().toUpperCase();
        const playerDatabase = window.authSystem.playerDatabase;
        
        if (playerDatabase[code]) {
            const player = playerDatabase[code];
            
            // Tenta carregar do backend primeiro (via auth.js)
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
            
            // SALVA NO BACKEND E NO LOCALSTORAGE (via auth.js)
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
                    <button class="btn btn-small toggle-quest-btn" data-id="${quest.id}">
                        ${quest.status === 'active' ? 'MARCAR COMO CONCLUÍDA' : 'REATIVAR MISSÃO'}
                    </button>
                    <button class="btn btn-small delete-quest-btn" data-id="${quest.id}">EXCLUIR</button>
                </div>
            `;
            questList.appendChild(questItem);
        });
        
        // Add event listeners to quest buttons
        document.querySelectorAll('.toggle-quest-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const questId = parseInt(e.target.getAttribute('data-id'));
                toggleQuestStatus(questId);
            });
        });
        
        document.querySelectorAll('.delete-quest-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const questId = parseInt(e.target.getAttribute('data-id'));
                deleteQuest(questId);
            });
        });
    }

    function toggleQuestStatus(questId) {
        const currentUser = sessionStorage.getItem('currentUser');
        const quests = JSON.parse(localStorage.getItem(`quests_${currentUser}`)) || [];
        
        const questIndex = quests.findIndex(q => q.id === questId);
        if (questIndex !== -1) {
            quests[questIndex].status = quests[questIndex].status === 'active' ? 'completed' : 'active';
            localStorage.setItem(`quests_${currentUser}`, JSON.stringify(quests));
            displayQuests(quests);
        }
    }

    function deleteQuest(questId) {
        const currentUser = sessionStorage.getItem('currentUser');
        let quests = JSON.parse(localStorage.getItem(`quests_${currentUser}`)) || [];
        
        quests = quests.filter(q => q.id !== questId);
        localStorage.setItem(`quests_${currentUser}`, JSON.stringify(quests));
        displayQuests(quests);
    }

    // Event Listeners
    if (loginBtn) {
        loginBtn.addEventListener('click', login);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    if (addQuestBtn) {
        addQuestBtn.addEventListener('click', addQuest);
    }

    if (codeInput) {
        codeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                login();
            }
        });
    }

    if (questTitleInput) {
        questTitleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addQuest();
            }
        });
    }

    // Initialize
    window.addEventListener('load', async () => {
        createMatrixRain();
        // Teste de backend já feito em auth.js
        
        const currentUser = sessionStorage.getItem('currentUser');
        if (currentUser && window.authSystem.playerDatabase[currentUser]) {
            codeInput.value = currentUser;
            login();
        } else {
            codeInput.focus();
        }
    });
});
