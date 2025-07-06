// /api/perfil/index.ts

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
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  // ======================
  // GET - Buscar dados do perfil
  // ======================
  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          profile: true,
        },
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

      const userReturn = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          email: true, // ← pegando o e-mail
          profile: true, // ← pegando todos os dados do profile
        },
      });

      // Buscando projetos do usuário
      const projetos = await prisma.projeto.findMany({
        where: { usuarioId: userReturn?.profile?.id },
        orderBy: { dataCriacao: "desc" },
        include: {
          arquivos: true,
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
      }));

      return res.status(200).json({
        email: userReturn.email,
        ...userReturn.profile,
        projetos: projetosFormatados,
      });
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      return res.status(500).json({ error: "Erro ao buscar perfil" });
    }
  }

  // ======================
  // PUT - Atualizar dados do perfil
  // ======================
  if (req.method === "PUT") {
    try {
      const {
        nome,
        telefone,
        idade,
        linkedin,
        curriculoLattes,
        biografia,
        tipoUsuario,
      } = req.body;

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

      // Agora pode atualizar com segurança
      const perfilAtualizado = await prisma.userProfile.update({
        where: { id: userAtt.profile.id },
        data: {
          fullName: nome,
          telefone,
          idade: idade ? Number(idade) : null,
          linkedin,
          curriculoLattes,
          biografia,
          tipoUsuario,
        },
      });

      return res.status(200).json(perfilAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      return res.status(500).json({ error: "Erro ao atualizar perfil" });
    }
  }
  
  return res.status(405).json({ error: "Método não permitido" });
}
