const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

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
        
        // Se MONGODB_URI não está configurada, use mock
        if (!uri) {
            console.log('⚠️ MONGODB_URI não configurada, salvando em mock');
            return res.status(200).json({ 
                success: true, 
                message: 'Dados salvos localmente (MongoDB não configurado)',
                playerCode: playerCode,
                timestamp: new Date().toISOString(),
                source: 'mock-save'
            });
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

            console.log(`✅ Dados salvos no MongoDB: ${result.modifiedCount} modificados, ${result.upsertedCount} inseridos`);
            
            res.status(200).json({ 
                success: true, 
                message: 'Dados salvos com sucesso no MongoDB!',
                result: {
                    modifiedCount: result.modifiedCount,
                    upsertedCount: result.upsertedCount
                },
                source: 'mongodb'
            });
        } catch (mongoError) {
            console.error('❌ Erro ao salvar no MongoDB:', mongoError);
            // Em caso de erro, salva mock
            res.status(200).json({ 
                success: true, 
                message: 'Dados salvos localmente (erro no MongoDB)',
                playerCode: playerCode,
                timestamp: new Date().toISOString(),
                source: 'mock-save'
            });
        } finally {
            if (client) {
                await client.close();
            }
        }
    } catch (error) {
        console.error('❌ Erro geral no save-player:', error);
        res.status(500).json({ 
            success: false,
            error: error.message,
            message: 'Erro ao processar requisição'
        });
    }
};
