import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    await client.connect();
    const db = client.db("fate-grandwar");
    const players = db.collection("players");

    const { id, name, level, score } = req.body;

    if (!id || !name) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    const result = await players.updateOne(
      { id },
      { $set: { name, level, score, updatedAt: new Date() } },
      { upsert: true }
    );

    res.status(200).json({ message: "Jogador salvo com sucesso!", result });
  } catch (err) {
    console.error("Erro ao salvar jogador:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  } finally {
    await client.close();
  }
}
