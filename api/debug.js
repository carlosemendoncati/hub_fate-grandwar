const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

module.exports = async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');

  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('fate-war');
    const count = await db.collection('players').countDocuments();
    await client.close();

    res.json({
      status: 'online',
      message: 'API Fate/Great War está viva!',
      mongodb: 'conectado',
      playersCount: count
    });
  } catch (error) {
    res.status(500).json({
      status: 'erro',
      message: 'Falha na conexão com MongoDB',
      error: error.message
    });
  }
};
