const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

// Fallback local (igual ao auth.js)
const playerDatabase = {
  'FG-8V501Y': {
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
    lastUpdated: new Date().toISOString()
  },
  'FG-TEST01': {
    code: 'FG-TEST01',
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
    },
    lastUpdated: new Date().toISOString()
  }
};

module.exports = async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-cache');

  try {
    const { code } = req.query;
    if (!code || code.length < 3) {
      return res.status(400).json({ success: false, error: 'Código inválido' });
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('fate-war');  // Ajustado para o nome real
    let player = await db.collection('players').findOne({ code });
    await client.close();

    if (!player) {
      player = playerDatabase[code];  // Fallback se MongoDB vazio
    }

    if (player) {
      res.json({ success: true, data: player });
    } else {
      res.status(404).json({ success: false, error: 'Jogador não encontrado' });
    }
  } catch (error) {
    console.error('Erro em get-player:', error.message);
    res.status(500).json({ success: false, error: 'Erro interno' });
  }
};
