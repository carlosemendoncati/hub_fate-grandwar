const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

module.exports = async (req, res) => {
  // Permite requisições de qualquer site
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db('fate-war');
    const collection = database.collection('players');

    const { playerCode, playerData } = req.body;

    await collection.updateOne(
      { code: playerCode },
      { 
        $set: { 
          ...playerData,
          lastUpdated: new Date() 
        } 
      },
      { upsert: true }
    );

    res.status(200).json({ 
      success: true, 
      message: 'Dados salvos com sucesso!' 
    });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
};
