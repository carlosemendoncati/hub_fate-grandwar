# Fate/Great War Hub - Sistema Completo de Gerenciamento de RPG

![Fate/Great War](https://img.shields.io/badge/Fate-Great%20War-blueviolet)
![Status](https://img.shields.io/badge/Status-Operacional-green)
![Tecnologia](https://img.shields.io/badge/Tecnologia-Node.js%20%7C%20MongoDB%20%7C%20Vercel-success)
![Segurança](https://img.shields.io/badge/Segurança-Configurada-yellow)

## ⚠️ Avisos de Segurança

**IMPORTANTE**: Este projeto segue práticas de segurança que devem ser mantidas:

- ✅ Credenciais protegidas via Environment Variables
- ✅ Permissões mínimas no banco de dados
- ✅ Headers de segurança configurados
- ❌ **NUNCA exponha credenciais no código fonte**
- ❌ **NUNCA use permissões administrativas desnecessárias**

## 📖 Índice

- [🎯 Visão Geral](#-visão-geral)
- [🚀 Funcionalidades](#-funcionalidades)
- [🛠️ Tecnologias](#️-tecnologias)
- [🏗️ Arquitetura](#️-arquitetura)
- [⚙️ Configuração Segura](#️-configuração-segura)
- [🎮 Como Usar](#-como-usar)
- [🔧 Desenvolvimento Seguro](#-desenvolvimento-seguro)
- [🐛 Solução de Problemas](#-solução-de-problemas)
- [📈 Melhorias Futuras](#-melhorias-futuras)
- [🔒 Política de Segurança](#-política-de-segurança)
- [📄 Licença](#-licença)

## 🎯 Visão Geral

O **Fate/Great War Hub** é um sistema completo de gerenciamento para mesas de RPG baseadas no universo Fate. Desenvolvido com interface estilo CRT inspirada em Matrix, oferece uma experiência imersiva para jogadores e mestres.

**URL do Projeto:** [https://hub-fate-grandwar.vercel.app](https://hub-fate-grandwar.vercel.app)

## 🚀 Funcionalidades

### 🎭 Sistema de Autenticação
- **Acesso por Código**: Sistema seguro com códigos únicos
- **Jogadores Pré-cadastrados**: Sistema de convites controlado
- **Sessão Persistente**: Login mantido entre refreshs
- **Fallback Seguro**: Funciona offline quando necessário

### 👤 Gerenciamento de Perfil
- **Dados Pessoais**: Nome, origem, perfil, natureza, motivação
- **Edição em Tempo Real**: Modo de edição com salvamento automático
- **Sistema Híbrido**: Salva tanto no MongoDB quanto localStorage

### ⚔️ Sistema do Servo
- **Classe e Alinhamento**: Sistema completo de classes
- **Atributos Visuais**: Barras de saúde e mana interativas
- **Vínculo**: Nível de conexão Mestre-Servo

### 🎯 Sistema de Missões
- **Criação Dinâmica**: Adicione missões personalizadas
- **Status de Progresso**: Ativa/Concluída com transições
- **Gerenciamento Completo**: CRUD completo de missões

## 🛠️ Tecnologias

### Frontend
- **HTML5** + **CSS3** com variáveis CSS
- **JavaScript ES6+** (Vanilla - sem frameworks)
- **Fontes**: Google Fonts (Share Tech Mono)
- **Design**: Tema CRT com efeito Matrix

### Backend
- **Runtime**: Node.js (Vercel Functions)
- **Serverless**: Arquitetura sem servidor
- **APIs REST**: Endpoints otimizados e seguros

### Database
- **MongoDB Atlas**: Banco de dados em nuvem com segurança
- **Coleção**: `players` com permissões restritas

### Infraestrutura
- **Plataforma**: Vercel com deploy automático
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
├── Configurações de Segurança
│   ├── vercel.json (Headers de segurança)
│   └── Environment Variables
└── Database (MongoDB Atlas)
    └── fate-war.players (Permissões restritas)
```

## ⚙️ Configuração Segura

### 🔒 Pré-requisitos de Segurança

1. **MongoDB Atlas** com usuário dedicado
2. **Vercel** com Environment Variables configuradas
3. **Network Access** restrito se necessário

### 🛡️ Configuração do MongoDB (Segura)

1. **Crie um Usuário Dedicado**:
   - Permissões: `Read and write to fate-war database only`
   - **NUNCA** use permissões administrativas

2. **Network Access**:
   - Configure IPs específicos ou `0.0.0.0/0` temporariamente
   - Use MongoDB Atlas VPC Peering para produção

3. **Connection String Segura**:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/fate-war?retryWrites=true&w=majority&authSource=admin
   ```

### 🔐 Configuração no Vercel

1. **Environment Variables**:
   ```env
   MONGODB_URI=sua_string_de_conexao_segura
   NODE_ENV=production
   ```

2. **Headers de Segurança** (vercel.json):
   ```json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           },
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           }
         ]
       }
     ]
   }
   ```

### 📁 Estrutura de Arquivos Segura

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
├── vercel.json
└── .env.example # (NUNCA commit .env real)
```

## 🎮 Como Usar

### Para Jogadores

1. **Acesso**: Visite [https://hub-fate-grandwar.vercel.app](https://hub-fate-grandwar.vercel.app)
2. **Login**: Use o código fornecido pelo mestre
3. **Navegação Segura**:
   - **Perfil**: Dados salvos com criptografia do MongoDB
   - **Servo**: Informações protegidas
   - **Missões**: Sistema privado de gerenciamento

### Para o Mestre

1. **Gerenciar Jogadores**: Via MongoDB Atlas ou interface administrativa
2. **Missões**: Sistema integrado seguro
3. **Comunicações**: Canal protegido

## 🔧 Desenvolvimento Seguro

### 🏗️ Estrutura de Dados

#### Jogador (Player Schema)
```javascript
{
  code: 'CODIGO_SEGURO', // Código único
  name: 'Nome Seguro',
  origin: 'Origem',
  profile: 'Perfil',
  nature: 'Natureza',
  motivation: 'Motivação',
  servant: {
    class: 'CLASS',
    name: 'CLASSIFICADO', // Dados sensíveis
    alignment: 'ALINHAMENTO',
    bond: 'NIVEL'
  },
  lastUpdated: '2024-01-01T00:00:00.000Z'
}
```

### 🔐 APIs Seguras

Todas as APIs incluem:
- Headers de segurança
- Validação de entrada
- Tratamento de erros seguro
- Logs sem informações sensíveis

#### Exemplo de API Segura
```javascript
// api/get-player.js
module.exports = async (req, res) => {
  // Headers de segurança
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-cache');
  
  try {
    const { code } = req.query;
    
    // Validação de entrada
    if (!code || code.length < 3) {
      return res.status(400).json({ error: 'Código inválido' });
    }
    
    // Lógica segura...
  } catch (error) {
    // Log sem expor detalhes sensíveis
    console.error('Erro na API:', error.message);
    res.status(500).json({ error: 'Erro interno' });
  }
};
```

## 🐛 Solução de Problemas

### 🔍 Diagnóstico Seguro

#### Verificar Conexão sem Expor Credenciais
```javascript
// Teste seguro - não expõe detalhes
fetch('/api/status')
  .then(r => r.json())
  .then(data => console.log('Status:', data.status));
```

#### Logs Seguros
```javascript
// ✅ FAÇA ISSO
console.log('API response status:', response.status);

// ❌ EVITE ISSO
console.log('Resposta completa:', response);
```

### 🛡️ Problemas de Segurança Comuns

#### 1. Variáveis de Ambiente Não Configuradas
**Sintoma**: Erro `MONGODB_URI is not defined`

**Solução**:
```bash
# Configure no Vercel Dashboard
MONGODB_URI=sua_string_segura
```

#### 2. Permissões Excessivas
**Sintoma**: Acesso a dados não autorizados

**Solução**:
- Revise permissões no MongoDB Atlas
- Use usuários dedicados por aplicação

## 📈 Melhorias Futuras

### 🚨 Prioridades de Segurança
- [ ] Autenticação JWT
- [ ] Rate Limiting nas APIs
- [ ] Criptografia de dados sensíveis
- [ ] Auditoria de logs
- [ ] Backup automatizado seguro

### 🎯 Funcionalidades
- [ ] Sistema de notificações
- [ ] Mapa interativo
- [ ] Sistema de inventário
- [ ] Integração com Discord Webhooks

## 🔒 Política de Segurança

### 1. Gestão de Credenciais
- ✅ Credenciais em Environment Variables
- ✅ Rotação periódica de senhas
- ✅ Acesso mínimo necessário
- ❌ Nenhuma credencial no código fonte

### 2. Proteção de Dados
- ✅ Dados pessoais protegidos
- ✅ Backups regulares
- ✅ Exclusão segura de dados

### 3. Desenvolvimento Seguro
- ✅ Validação de entrada
- ✅ Headers de segurança
- ✅ Tratamento de erros seguro
- ✅ Logs sem informações sensíveis

### 4. Monitoramento
- ✅ Logs de acesso
- ✅ Monitoramento de performance
- ✅ Alertas de segurança

### 5. Resposta a Incidentes
1. **Isolar** o sistema afetado
2. **Investigar** a causa raiz
3. **Corrigir** a vulnerabilidade
4. **Comunicar** às partes afetadas
5. **Prevenir** recorrência

## 📄 Licença

Este projeto é desenvolvido para uso na campanha **Fate/Great War**.

### Direitos Autorais
- **Sistema Fate**: Criado por Evil Hat Productions
- **Conteúdo Original**: Desenvolvido para campanha pessoal
- **Código**: Disponível para fins educacionais

### Uso e Distribuição
- ✅ Uso pessoal e campanhas caseiras
- ✅ Modificações para uso próprio
- ✅ Estudo do código fonte
- ❌ Distribuição comercial
- ❌ Venda do sistema

## 👥 Créditos

### Desenvolvimento
- **Sistema**: Desenvolvido com práticas de segurança
- **Arquitetura**: Vercel + MongoDB com configurações seguras
- **Design**: Interface responsiva e acessível

### Agradecimentos Especiais
- Equipe de segurança por revisões
- Comunidade de desenvolvimento por boas práticas

---

<div align="center">

**🔒 Sistema Desenvolvido com Segurança em Mente**

[![Acessar Sistema](https://img.shields.io/badge/Acessar-Fate/Great_War_Hub-blue?style=for-the-badge&logo=shield)](https://hub-fate-grandwar.vercel.app)

*"Diversão responsável começa com código seguro"*

</div>

---

## 📞 Suporte e Segurança

Se você identificar qualquer vulnerabilidade de segurança, por favor:
1. **Não divulgue publicamente**
2. Entre em contato privadamente
3. Aguarde a correção antes de compartilhar

**Juntos mantemos a comunidade segura!** 🛡️
