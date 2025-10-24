const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

// Configurações otimizadas para Vercel
const mongoOptions = {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 10000,
    connectTimeoutMS: 10000,
};

module.exports = async (req, res) => {
    console.log('🔍 GET Player - Iniciando requisição...');
    
    // Headers de segurança e CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    if (req.method === 'OPTIONS') {
        console.log('✅ OPTIONS preflight OK');
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
        
        // Verificação robusta da URI
        if (!uri || typeof uri !== 'string' || uri.trim().length === 0) {
            console.log('⚠️ MONGODB_URI não configurada ou inválida - usando fallback');
            return getMockPlayer(code, res);
        }

        let client;
        try {
            console.log('🔗 Tentando conectar ao MongoDB...');
            client = new MongoClient(uri, mongoOptions);
            await client.connect();
            console.log('✅ Conectado ao MongoDB');
            
            const database = client.db('fate-war');
            const collection = database.collection('players');

            console.log(`📊 Buscando jogador ${code} no banco...`);
            const player = await collection.findOne({ code: code });

            if (player) {
                console.log(`✅ Jogador encontrado: ${player.name}`);
                res.status(200).json({ 
                    success: true, 
                    data: player,
                    source: 'mongodb'
                });
            } else {
                console.log(`❌ Jogador não encontrado no banco: ${code}`);
                res.status(404).json({ 
                    success: false, 
                    error: 'Jogador não encontrado no banco de dados'
                });
            }
        } catch (mongoError) {
            console.error('❌ Erro no MongoDB:', mongoError.message);
            // Fallback para dados mock em caso de erro
            console.log('🔄 Usando fallback para dados mock devido a erro no MongoDB');
            return getMockPlayer(code, res);
        } finally {
            if (client) {
                await client.close();
                console.log('🔌 Conexão com MongoDB fechada');
            }
        }
    } catch (error) {
        console.error('💥 Erro geral no get-player:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
};

// Função de fallback com dados mock
function getMockPlayer(code, res) {
    console.log('🎭 Usando dados mock para:', code);
    
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
        res.status(200).json({ 
            success: true, 
            data: player,
            source: 'mock-data',
            message: 'Dados de teste (MongoDB em configuração)'
        });
    } else {
        res.status(404).json({ 
            success: false, 
            error: 'Jogador não encontrado',
            available_codes: Object.keys(mockPlayers)
        });
    }
}
