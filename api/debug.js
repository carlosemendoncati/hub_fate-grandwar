const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    console.log('🔧 API Debug - Iniciando...');
    
    // Headers básicos
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const debugInfo = {
            success: true,
            message: 'API Debug funcionando!',
            timestamp: new Date().toISOString(),
            environment: {
                node_env: process.env.NODE_ENV,
                vercel_region: process.env.VERCEL_REGION,
                mongodb_uri_configured: !!process.env.MONGODB_URI,
                mongodb_uri_type: typeof process.env.MONGODB_URI,
                mongodb_uri_length: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0
            }
        };

        console.log('📊 Debug Info:', debugInfo);

        // Teste de conexão com MongoDB apenas se MONGODB_URI for uma string não vazia
        if (process.env.MONGODB_URI && typeof process.env.MONGODB_URI === 'string' && process.env.MONGODB_URI.trim().length > 0) {
            debugInfo.mongodb_test = await testMongoDBConnection();
        } else {
            debugInfo.mongodb_test = {
                connected: false,
                error: 'MONGODB_URI não está definida ou é inválida'
            };
        }

        res.status(200).json(debugInfo);
    } catch (error) {
        console.error('❌ Erro no debug:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
        });
    }
};

async function testMongoDBConnection() {
    const uri = process.env.MONGODB_URI;
    let client;
    
    try {
        console.log('🔗 Testando conexão com MongoDB...');
        
        client = new MongoClient(uri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 10000,
        });

        await client.connect();
        console.log('✅ Conectado ao MongoDB - testando ping...');
        
        // Testa a conexão com um comando simples
        await client.db().admin().ping();
        console.log('✅ Ping bem-sucedido!');
        
        return { 
            connected: true, 
            message: 'Conexão com MongoDB estabelecida com sucesso',
            database: 'fate-war'
        };
    } catch (error) {
        console.error('❌ Erro na conexão com MongoDB:', error.message);
        return { 
            connected: false, 
            error: error.message,
            suggestion: 'Verifique: 1) String de conexão 2) Network Access no MongoDB Atlas 3) Credenciais'
        };
    } finally {
        if (client) {
            await client.close();
        }
    }
}
