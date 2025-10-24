const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const client = new MongoClient(uri);
  
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: 'Código é obrigatório' });
    }

    await client.connect();
    const database = client.db('fate-war');
    const collection = database.collection('players');

    const player = await collection.findOne({ code: code });

    if (player) {
      res.status(200).json({ success: true, data: player });
    } else {
      res.status(404).json({ success: false, error: 'Jogador não encontrado' });
    }
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
};
