// pages/api/testdb.js
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  try {
    const usuarios = await prisma.usuario.findMany({
      take: 5,
      select: {
        id: true,
        nome: true,
        email: true,
        tipoUsuario: true,
      },
    });

    res.status(200).json({ usuarios });
  } catch (err) {
    console.error("Erro ao consultar o banco via Prisma:", err);
    res.status(500).json({ error: err.message });
  }
}
