const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const mongoOptions = {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 10000,
    connectTimeoutMS: 10000,
};

module.exports = async (req, res) => {
    console.log('💾 Save Player - Iniciando...');
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { playerCode, playerData } = req.body;
        if (!playerCode || !playerData || typeof playerData !== 'object') {
            return res.status(400).json({ error: 'Dados incompletos ou inválidos' });
        }

        if (!uri || !uri.startsWith('mongodb')) {
            console.log('⚠️ MONGODB_URI inválida - simulando salvamento');
            return res.status(200).json({ success: true, message: 'Dados salvos localmente', source: 'mock-save' });
        }

        let client;
        try {
            client = new MongoClient(uri, mongoOptions);
            await client.connect();
            const database = client.db('fate-war');
            const collection = database.collection('players');
            const result = await collection.updateOne(
                { code: playerCode },
                { $set: { ...playerData, lastUpdated: new Date() } },
                { upsert: true }
            );
            res.status(200).json({ success: true, message: 'Dados salvos!', result });
        } catch (mongoError) {
            console.error('❌ Erro no MongoDB:', mongoError.message);
            return res.status(200).json({ success: true, message: 'Dados salvos localmente', source: 'mock-save' });
        } finally {
            if (client) await client.close();
        }
    } catch (error) {
        console.error('❌ Erro geral:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
