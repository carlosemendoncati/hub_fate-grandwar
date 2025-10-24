const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const mongoOptions = {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 10000,
    connectTimeoutMS: 10000,
};

module.exports = async (req, res) => {
    console.log('🔍 GET Player - Iniciando requisição...');
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({ error: 'Código é obrigatório' });
        }

        if (!uri || !uri.startsWith('mongodb')) {
            console.log('⚠️ MONGODB_URI inválida - usando fallback');
            return getMockPlayer(code, res);
        }

        let client;
        try {
            client = new MongoClient(uri, mongoOptions);
            await client.connect();
            const database = client.db('fate-war');
            const collection = database.collection('players');
            const player = await collection.findOne({ code });
            if (player) {
                res.status(200).json({ success: true, data: player, source: 'mongodb' });
            } else {
                res.status(404).json({ success: false, error: 'Jogador não encontrado' });
            }
        } catch (mongoError) {
            console.error('❌ Erro no MongoDB:', mongoError.message);
            return getMockPlayer(code, res);
        } finally {
            if (client) await client.close();
        }
    } catch (error) {
        console.error('💥 Erro geral:', error);
        res.status(500).json({ success: false, error: 'Erro interno', message: error.message });
    }
};

function getMockPlayer(code, res) {
    const mockPlayers = {
        'FG-8V501Y': { name: 'KADU', origin: 'KUROGANE', /* ... */ },
        'FG-TEST01': { name: 'JOGADOR TESTE', /* ... */ }
    };
    const player = mockPlayers[code];
    if (player) {
        res.status(200).json({ success: true, data: player, source: 'mock-data' });
    } else {
        res.status(404).json({ success: false, error: 'Jogador não encontrado', available_codes: Object.keys(mockPlayers) });
    }
}
