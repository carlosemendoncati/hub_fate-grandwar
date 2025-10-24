import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    await client.connect();
    const db = client.db("fate-grandwar");
    const players = db.collection("players");

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "ID do jogador é obrigatório" });
    }

    const player = await players.findOne({ id });

    if (!player) {
      return res.status(404).json({ error: "Jogador não encontrado" });
    }

    res.status(200).json(player);
  } catch (err) {
    console.error("Erro ao buscar jogador:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  } finally {
    await client.close();
  }
}
