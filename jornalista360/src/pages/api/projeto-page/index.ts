// /pages/api/projeto-page.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

type Arquivo = {
  id: number;
  url: string;
  tipo: "FOTO" | "PDF" | "VIDEO";
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "ID do projeto inválido" });
  }

  try {
    const projeto = await prisma.projeto.findUnique({
      where: { id: parseInt(id) },
      include: {
        arquivos: true,
        usuario: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!projeto) {
      return res.status(404).json({ error: "Projeto não encontrado" });
    }

    const usuario = await prisma.userProfile.findUnique({
      where: { id: projeto.usuarioId },
    });

    const projetoFormatado = {
      id: projeto.id,
      titulo: projeto.titulo,
      descricao: projeto.descricao,
      tipo: projeto.tipo,
      dataCriacao: projeto.dataCriacao,
      imagens: projeto.arquivos
        .filter((a: Arquivo) => a.tipo === "FOTO")
        .map((a: Arquivo) => a.url),
      pdfs: projeto.arquivos
        .filter((a: Arquivo) => a.tipo === "PDF")
        .map((a: Arquivo) => a.url),
      youtubeLinks: projeto.arquivos
        .filter((a: Arquivo) => a.tipo === "VIDEO")
        .map((a: Arquivo) => a.url),
      usuario: {
        id: projeto.usuario.user.id,
        name: projeto.usuario.user.name,
      },
    };

    const usuarioFormatado = {
      nome: usuario?.fullName ?? "",
      email: projeto.usuario.user.email,
      telefone: usuario?.telefone ?? "",
      idade: usuario?.idade?.toString() ?? "",
      linkedin: usuario?.linkedin ?? "",
      curriculoLattes: usuario?.curriculoLattes ?? "",
      fotoUrl: usuario?.fotoUrl ?? "",
      biografia: usuario?.biografia ?? "",
      tipoUsuario: usuario?.tipoUsuario ?? "ALUNO",
    };

    return res.status(200).json({ projeto: projetoFormatado, usuario: usuarioFormatado });
  } catch (error) {
    console.error("Erro ao buscar projeto por ID:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
