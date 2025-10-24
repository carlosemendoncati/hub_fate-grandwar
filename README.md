# Fate/Great War Hub - Sistema Completo de Gerenciamento de RPG

![Fate/Great War](https://img.shields.io/badge/Fate-Great%20War-blueviolet)
![Status](https://img.shields.io/badge/Status-Operacional-green)
![Tecnologia](https://img.shields.io/badge/Tecnologia-Node.js%20%7C%20MongoDB%20%7C%20Vercel-success)

## 📖 Índice

- [🎯 Visão Geral](#-visão-geral)
- [🚀 Funcionalidades](#-funcionalidades)
- [🛠️ Tecnologias](#️-tecnologias)
- [🏗️ Arquitetura](#️-arquitetura)
- [⚙️ Configuração](#️-configuração)
- [🎮 Como Usar](#-como-usar)
- [🔧 Desenvolvimento](#-desenvolvimento)
- [🐛 Solução de Problemas](#-solução-de-problemas)
- [📈 Melhorias Futuras](#-melhorias-futuras)
- [📄 Licença](#-licença)

## 🎯 Visão Geral

O **Fate/Great War Hub** é um sistema completo de gerenciamento para mesas de RPG baseadas no universo Fate. Desenvolvido com interface estilo CRT inspirada em Matrix, oferece uma experiência imersiva para jogadores e mestres.

**URL do Projeto:** [https://hub-fate-grandwar.vercel.app](https://hub-fate-grandwar.vercel.app)

## 🚀 Funcionalidades

### 🎭 Sistema de Autenticação
- **Acesso por Código**: Sistema seguro com códigos únicos
- **Jogadores Pré-cadastrados**:
  - `FG-8V501Y` - KADU (Mago de Kurogane)
  - `FG-TEST01` - Jogador Teste
- **Sessão Persistente**: Login mantido entre refreshs

### 👤 Gerenciamento de Perfil
- **Dados Pessoais**: Nome, origem, perfil, natureza, motivação
- **Edição em Tempo Real**: Modo de edição com salvamento automático
- **Sistema Híbrido**: Salva tanto no MongoDB quanto localStorage

### ⚔️ Sistema do Servo
- **Classe e Alinhamento**: Saber, Archer, etc.
- **Atributos Visuais**: Barras de saúde e mana
- **Vínculo**: Nível de conexão Mestre-Servo

### 🎯 Sistema de Missões
- **Criação Dinâmica**: Adicione missões personalizadas
- **Status de Progresso**: Ativa/Concluída
- **Gerenciamento Completo**: Editar, concluir, excluir

### 📊 Inteligência da Guerra
- **Status da Campanha**: Fase atual, participantes ativos
- **Contagem Regressiva**: Dias até próximos eventos
- **Localização**: Mapa da guerra em Kurogane

### 📨 Comunicações
- **Mensagens do Mestre**: Sistema de briefing integrado
- **Notificações**: Alertas importantes

## 🛠️ Tecnologias

### Frontend
- **HTML5** + **CSS3** com variáveis CSS
- **JavaScript ES6+** (Vanilla - sem frameworks)
- **Fontes**: Google Fonts (Share Tech Mono)
- **Design**: Tema CRT com efeito Matrix

### Backend
- **Runtime**: Node.js (Vercel Functions)
- **Serverless**: Arquitetura sem servidor
- **APIs REST**: Endpoints otimizados

### Database
- **MongoDB Atlas**: Banco de dados em nuvem
- **Coleção**: `players` no database `fate-war`

### Infraestrutura
- **Plataforma**: Vercel
- **CDN**: Distribuição global
- **Environment Variables**: Configurações seguras

## 🏗️ Arquitetura

```
Fate/Great War Hub
├── Frontend (Vercel)
│   ├── public/index.html
│   ├── public/css/style.css
│   └── public/js/
│       ├── auth.js (Sistema de autenticação)
│       └── hub.js (Lógica principal)
├── Backend (Vercel Functions)
│   ├── api/get-player.js
│   ├── api/save-player.js
│   ├── api/test-mongodb.js
│   ├── api/init-db.js
│   └── api/status.js
└── Database (MongoDB Atlas)
    └── fate-war.players
```

## ⚙️ Configuração

### Pré-requisitos
- Conta no [Vercel](https://vercel.com)
- Conta no [MongoDB Atlas](https://www.mongodb.com/atlas)
- Node.js 18+ (para desenvolvimento local)

### Configuração do MongoDB

1. **Crie um Cluster no MongoDB Atlas**
2. **Configure Database Access**:
   ```javascript
   Usuário: Vercel-Admin-fate-war
   Senha: eiKjnDd8Chf7ZRQL
   Permissões: Read and write to any database
   ```

3. **Configure Network Access**:
   - Adicione `0.0.0.0/0` (Allow access from anywhere)

4. **Obtenha a Connection String**:
   ```
   mongodb+srv://Vercel-Admin-fate-war:eiKjnDd8Chf7ZRQL@fate-war.4ovuzrp.mongodb.net/fate-war?retryWrites=true&w=majority
   ```

### Configuração no Vercel

1. **Environment Variables**:
   ```
   MONGODB_URI = mongodb+srv://Vercel-Admin-fate-war:eiKjnDd8Chf7ZRQL@fate-war.4ovuzrp.mongodb.net/fate-war?retryWrites=true&w=majority
   ```

2. **Deploy Automático**: Conecte com GitHub para CI/CD

### Estrutura de Arquivos

```bash
fate-war-hub/
├── public/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── auth.js
│       └── hub.js
├── api/
│   ├── get-player.js
│   ├── save-player.js
│   ├── test-mongodb.js
│   ├── init-db.js
│   └── status.js
├── package.json
└── vercel.json
```

## 🎮 Como Usar

### Para Jogadores

1. **Acesso**: Visite [https://hub-fate-grandwar.vercel.app](https://hub-fate-grandwar.vercel.app)
2. **Login**: Use um dos códigos:
   - `FG-8V501Y` (KADU)
   - `FG-TEST01` (Jogador Teste)
3. **Navegação**:
   - **Perfil**: Visualize e edite seus dados
   - **Servo**: Acompanhe status do Servant
   - **Guerra**: Veja informações da campanha
   - **Missões**: Gerencie suas quests
   - **Mensagens**: Comunique-se com o mestre

### Para o Mestre

1. **Adicionar Jogadores**: Edite o `playerDatabase` no `auth.js`
2. **Gerenciar Missões**: Use o sistema integrado
3. **Comunicações**: Envie mensagens via painel

### Comandos de Debug

```javascript
// No console do navegador
// Testar conexão MongoDB
fetch('/api/test-mongodb').then(r => r.json()).then(console.log)

// Testar busca de jogador
fetch('/api/get-player?code=FG-8V501Y').then(r => r.json()).then(console.log)

// Verificar status do sistema
fetch('/api/status').then(r => r.json()).then(console.log)
```

## 🔧 Desenvolvimento

### Estrutura de Dados

#### Jogador (Player Schema)
```javascript
{
  code: 'FG-8V501Y',
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
  },
  lastUpdated: '2024-01-01T00:00:00.000Z'
}
```

#### Missão (Quest Schema)
```javascript
{
  id: 123456789,
  title: 'Investigar o Rio Akagane',
  description: 'Procure por sinais de atividade mágica',
  status: 'active', // ou 'completed'
  createdAt: '24/10/2024'
}
```

### APIs Disponíveis

#### GET `/api/get-player?code={code}`
Busca dados de um jogador.

**Resposta:**
```json
{
  "success": true,
  "data": { ...playerData },
  "source": "mongodb"
}
```

#### POST `/api/save-player`
Salva dados do jogador.

**Body:**
```json
{
  "playerCode": "FG-8V501Y",
  "playerData": { ...playerData }
}
```

#### GET `/api/test-mongodb`
Testa conexão com o MongoDB.

#### GET `/api/init-db`
Inicializa banco com dados de exemplo.

#### GET `/api/status`
Retorna status do sistema.

### Variáveis CSS Principais

```css
:root {
  --crt-green: #98ff9a;
  --crt-dim: #6fbf7a;
  --accent: #44ff88;
  --muted: #7a9aa0;
  --bg-dark: #040608;
  --bg-gradient: radial-gradient(ellipse at center, #071015 0%, #030406 60%, #000 100%);
  --glow: 0 0 18px rgba(68,255,136,0.12);
  --font: 'Share Tech Mono', monospace;
}
```

## 🐛 Solução de Problemas

### Problemas Comuns

#### 1. Botão de Login Não Funciona
**Sintoma**: Clicar em "Autenticar" não faz nada.

**Solução**:
```javascript
// Verifique no console
console.log(document.getElementById('login-btn'));
console.log(window.authSystem);

// Solução alternativa
document.getElementById('login-btn').onclick = function() {
    alert('Botão funcionando!');
    // Adicione sua lógica de login aqui
};
```

#### 2. Erro de Conexão com MongoDB
**Sintoma**: `FUNCTION_INVOCATION_FAILED` ou `MONGODB_URI not defined`.

**Solução**:
1. Verifique a variável `MONGODB_URI` no Vercel
2. Confirme as permissões no MongoDB Atlas
3. Teste com: `/api/test-mongodb`

#### 3. Dados Não São Salvos
**Sintoma**: Edições não persistem.

**Solução**:
- O sistema tem fallback para localStorage
- Verifique o console por erros de rede
- Teste a API save-player diretamente

### Logs e Monitoramento

#### Frontend
- Abra o Console (F12) para ver logs em tempo real
- Mensagens incluem: `✅`, `⚠️`, `❌` para fácil identificação

#### Backend
- Acesse Vercel Dashboard → Functions
- Veja logs das APIs em tempo real

#### MongoDB
- Acesse MongoDB Atlas → Monitoring
- Verifique métricas de performance

## 📈 Melhorias Futuras

### Prioridade Alta
- [ ] Sistema de notificações em tempo real
- [ ] Upload de imagens de perfil
- [ ] Sistema de inventário
- [ ] Mapa interativo da guerra

### Prioridade Média
- [ ] Modo escuro/claro
- [ ] Exportação de dados
- [ ] Sistema de achievements
- [ ] Integração com Discord

### Prioridade Baixa
- [ ] App móvel nativo
- [ ] Sistema de áudio
- [ ] Animações avançadas
- [ ] Múltiplos idiomas

## 🎨 Personalização

### Adicionar Novos Jogadores

Em `auth.js`, modifique o `playerDatabase`:

```javascript
const playerDatabase = {
  'FG-NOVOCOD': {
    name: 'NOVO JOGADOR',
    origin: 'NOVA ORIGEM',
    profile: 'NOVO PERFIL',
    nature: 'NOVA NATUREZA',
    motivation: 'NOVA MOTIVAÇÃO',
    servant: {
      class: 'CASTER',
      name: 'CLASSIFICADO',
      alignment: 'NEUTRO',
      bond: 'INICIAL'
    }
  }
};
```

### Modificar Cores e Tema

Em `style.css`, edite as variáveis CSS:

```css
:root {
  --accent: #ff4455; /* Mude para vermelho */
  --crt-green: #ff9999; /* Tema diferente */
}
```

## 📄 Licença

Este projeto é desenvolvido para uso na campanha **Fate/Great War**. 

### Direitos Autorais
- **Sistema Fate**: Criado por Evil Hat Productions
- **Conteúdo Original**: Desenvolvido para a campanha pessoal
- **Código**: Disponível para fins educacionais

### Uso e Distribuição
- ✅ Uso pessoal e campanhas caseiras
- ✅ Modificações para suas próprias campanhas
- ✅ Estudo do código fonte
- ❌ Distribuição comercial
- ❌ Venda do sistema

## 👥 Créditos

### Desenvolvimento
- **Sistema**: Desenvolvido com ChatGPT Assistência
- **Arquitetura**: Integração Vercel + MongoDB
- **Design**: Interface CRT inspirada em Matrix

### Tecnologias
- [Vercel](https://vercel.com) - Hospedagem e Functions
- [MongoDB Atlas](https://mongodb.com) - Banco de dados
- [Google Fonts](https://fonts.google.com) - Tipografia

---

**✨ Desenvolvido para a Campanha Fate/Great War ✨**

*"Onde mestres e jogadores se encontram para criar histórias épicas"*

---

<div align="center">

**⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!**

[![Acessar Sistema](https://img.shields.io/badge/Acessar-Fate/Great_War_Hub-blue?style=for-the-badge)](https://hub-fate-grandwar.vercel.app)

</div>
