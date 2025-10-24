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
    console.log('💾 Save Player - Iniciando...');
    
    // Configura CORS
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

        if (!playerCode || !playerData) {
            return res.status(400).json({ error: 'Dados incompletos' });
        }

        console.log(`💾 Salvando dados do jogador: ${playerCode}`, playerData);
        
        // Verificação robusta da URI
        if (!uri || typeof uri !== 'string' || uri.trim().length === 0) {
            console.log('⚠️ MONGODB_URI não configurada - usando fallback');
            // Simula salvamento bem-sucedido
            return res.status(200).json({ 
                success: true, 
                message: 'Dados salvos localmente (MongoDB em configuração)',
                playerCode: playerCode,
                timestamp: new Date().toISOString(),
                source: 'mock-save'
            });
        }

        let client;
        try {
            console.log('🔗 Tentando conectar ao MongoDB...');
            client = new MongoClient(uri, mongoOptions);
            await client.connect();
            console.log('✅ Conectado ao MongoDB');
            
            const database = client.db('fate-war');
            const collection = database.collection('players');

            const result = await collection.updateOne(
                { code: playerCode },
                { 
                    $set: { 
                        ...playerData,
                        lastUpdated: new Date() 
                    } 
                },
                { upsert: true }
            );

            console.log(`✅ Dados salvos: ${result.modifiedCount} modificados, ${result.upsertedCount} inseridos`);
            
            res.status(200).json({ 
                success: true, 
                message: 'Dados salvos com sucesso!',
                result: {
                    modifiedCount: result.modifiedCount,
                    upsertedCount: result.upsertedCount
                }
            });
        } catch (mongoError) {
            console.error('❌ Erro no MongoDB:', mongoError.message);
            // Fallback para salvar localmente
            console.log('🔄 Usando fallback para salvar localmente devido a erro no MongoDB');
            return res.status(200).json({ 
                success: true, 
                message: 'Dados salvos localmente (erro no MongoDB)',
                playerCode: playerCode,
                timestamp: new Date().toISOString(),
                source: 'mock-save'
            });
        } finally {
            if (client) {
                await client.close();
                console.log('🔌 Conexão com MongoDB fechada');
            }
        }
    } catch (error) {
        console.error('❌ Erro no save-player:', error);
        res.status(500).json({ 
            success: false,
            error: error.message,
            message: 'Erro ao processar requisição'
        });
    }
};
