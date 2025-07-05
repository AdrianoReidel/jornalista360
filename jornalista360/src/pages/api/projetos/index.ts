// /api/projetos/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

type ProjetoComIncludes = Prisma.ProjetoGetPayload<{
  include: {
    arquivos: true;
    usuario: {
      include: {
        user: true;
      };
    };
  };
}>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // --- CRIAÇÃO DE PROJETO ---
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    try {
      const { titulo, descricao, tipo, imagens, pdfs, youtubeLinks } = req.body;

      if (!titulo || !tipo) {
        return res.status(400).json({ error: "Título e tipo são obrigatórios" });
      }

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { profile: true },
      });

      if (user && !user.profile) {
        const novoPerfil = await prisma.userProfile.create({
          data: {
            fullName: user.name ?? null,
            fotoUrl: user.image ?? null,
            criadoViaGoogle: true,
            user: {
              connect: { id: user.id },
            },
          },
        });

        await prisma.user.update({
          where: { id: user.id },
          data: {
            profile: {
              connect: { id: novoPerfil.id },
            },
          },
        });
      }

      const userAtt = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { profile: true },
      });

      if (!userAtt || !userAtt.profile) {
        return res.status(404).json({ error: "Usuário ou perfil não encontrado" });
      }

      const projetoCriado = await prisma.projeto.create({
        data: {
          titulo,
          descricao,
          tipo,
          usuario: {
            connect: { id: userAtt.profile.id },
          },
          arquivos: {
            create: [
              ...(imagens || []).map((url: string) => ({ url, tipo: "FOTO" })),
              ...(pdfs || []).map((url: string) => ({ url, tipo: "PDF" })),
              ...(youtubeLinks || []).map((url: string) => ({
                url,
                tipo: "VIDEO",
              })),
            ],
          },
        },
        include: {
          arquivos: true,
          usuario: {
            include: {
              user: true, // Para acessar o nome do usuário real
            },
          },
        },
      });

      return res.status(201).json(projetoCriado);
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      return res.status(500).json({ error: "Erro ao criar projeto" });
    }
  }

  // --- LISTAGEM DE PROJETOS (GET) ---
  if (req.method === "GET") {
    try {
      const projetos = await prisma.projeto.findMany({
        orderBy: { dataCriacao: "desc" },
        include: {
          arquivos: true,
          usuario: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      const projetosFormatados = projetos.map((projeto: ProjetoComIncludes) => ({
        id: projeto.id,
        titulo: projeto.titulo,
        descricao: projeto.descricao,
        tipo: projeto.tipo,
        dataCriacao: projeto.dataCriacao,
        imagens: projeto.arquivos.filter((a) => a.tipo === "FOTO").map((a) => a.url),
        pdfs: projeto.arquivos.filter((a) => a.tipo === "PDF").map((a) => a.url),
        youtubeLinks: projeto.arquivos.filter((a) => a.tipo === "VIDEO").map((a) => a.url),
        usuario: {
          id: projeto.usuario?.user?.id ?? "sem-id",
          name: projeto.usuario?.user?.name ?? "Usuário desconhecido",
        },
      }));

      return res.status(200).json(projetosFormatados);
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
      return res.status(500).json({ error: "Erro ao buscar projetos" });
    }
  }

  return res.status(405).json({ error: "Método não permitido" });
}
