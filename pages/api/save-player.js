const { PrismaClient } = require('@prisma/client');

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

module.exports = async (req, res) => {
  // Configura CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL não configurado');
    return res.status(500).json({ success: false, error: 'DATABASE_URL não configurado' });
  }

  try {
    const { playerCode, playerData } = req.body;

    if (!playerCode || !playerData) {
      return res.status(400).json({ error: 'playerCode e playerData são obrigatórios' });
    }

    // Normalize mapping: frontend sends playerData.servant (nested), DB columns are flat.
    const upsertData = {
      code: playerCode,
      name: playerData.name || '',
      origin: playerData.origin || '',
      profile: playerData.profile || '',
      nature: playerData.nature || '',
      motivation: playerData.motivation || '',
      servantClass: (playerData.servant && playerData.servant.class) || playerData.servantClass || '',
      servantName: (playerData.servant && playerData.servant.name) || playerData.servantName || '',
      servantAlignment: (playerData.servant && playerData.servant.alignment) || playerData.servantAlignment || '',
      servantBond: (playerData.servant && playerData.servant.bond) || playerData.servantBond || '',
      lastUpdated: new Date()
    };

    const result = await prisma.player.upsert({
      where: { code: playerCode },
      update: upsertData,
      create: upsertData
    });

    res.status(200).json({
      success: true,
      message: 'Dados salvos com sucesso!',
      data: result
    });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: error.message });
  }
};
