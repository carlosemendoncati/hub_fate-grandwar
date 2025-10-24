const { PrismaClient } = require('@prisma/client');

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL não configurado');
    return res.status(500).json({ success: false, error: 'DATABASE_URL não configurado' });
  }

  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Código é obrigatório' });
    }

    const player = await prisma.player.findUnique({
      where: { code: code }
    });

    if (!player) {
      return res.status(404).json({ success: false, error: 'Jogador não encontrado' });
    }

    // Map DB model to frontend shape
    const data = {
      name: player.name,
      origin: player.origin,
      profile: player.profile,
      nature: player.nature,
      motivation: player.motivation,
      servant: {
        class: player.servantClass,
        name: player.servantName,
        alignment: player.servantAlignment,
        bond: player.servantBond
      },
      lastUpdated: player.lastUpdated
    };

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Erro:', error);
    return res.status(500).json({ error: error.message });
  }
};
