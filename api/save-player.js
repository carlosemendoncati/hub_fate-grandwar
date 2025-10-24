const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

module.exports = async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-cache');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método não permitido' });
  }

  try {
    const { playerCode, playerData } = req.body;
    if (!playerCode || !playerData) {
      return res.status(400).json({ success: false, error: 'Dados inválidos' });
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('fate-war');  // Ajustado para o nome real
    await db.collection('players').updateOne(
      { code: playerCode },
      { $set: { ...playerData, lastUpdated: new Date().toISOString() } },
      { upsert: true }
    );
    await client.close();

    res.json({ success: true, message: 'Dados salvos' });
  } catch (error) {
    console.error('Erro em save-player:', error.message);
    res.status(500).json({ success: false, error: 'Erro interno' });
  }
};
