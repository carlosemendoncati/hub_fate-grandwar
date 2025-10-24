const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

module.exports = async (req, res) => {
    console.log('🔍 GET Player - Iniciando...');
    
    // Headers de segurança e CORS
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

        console.log(`🔍 Buscando jogador: ${code}`);
        
        // Se MONGODB_URI não está configurada, use mock
        if (!uri) {
            console.log('⚠️ MONGODB_URI não configurada, usando dados mock');
            return getMockPlayer(code, res);
        }

        let client;
        try {
            client = new MongoClient(uri, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
            await client.connect();
            console.log('✅ Conectado ao MongoDB');
            
            const database = client.db('fate-war');
            const collection = database.collection('players');

            const player = await collection.findOne({ code: code });

            if (player) {
                console.log(`✅ Jogador encontrado no MongoDB: ${player.name}`);
                res.status(200).json({ success: true, data: player, source: 'mongodb' });
            } else {
                console.log(`❌ Jogador não encontrado no MongoDB: ${code}`);
                // Se não encontrou no MongoDB, tenta o mock
                getMockPlayer(code, res);
            }
        } catch (mongoError) {
            console.error('❌ Erro ao conectar ao MongoDB:', mongoError);
            // Em caso de erro, usa mock
            getMockPlayer(code, res);
        } finally {
            if (client) {
                await client.close();
            }
        }
    } catch (error) {
        console.error('❌ Erro geral no get-player:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            message: 'Erro interno do servidor'
        });
    }
};

function getMockPlayer(code, res) {
    const mockPlayers = {
        'FG-8V501Y': {
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

    const player = mockPlayers[code];

    if (player) {
        console.log(`✅ Jogador encontrado em mock: ${player.name}`);
        res.status(200).json({ 
            success: true, 
            data: player,
            source: 'mock-data',
            message: 'Dados de teste (MongoDB indisponível)'
        });
    } else {
        console.log(`❌ Jogador não encontrado em mock: ${code}`);
        res.status(404).json({ 
            success: false, 
            error: 'Jogador não encontrado',
            available_codes: Object.keys(mockPlayers)
        });
    }
}
