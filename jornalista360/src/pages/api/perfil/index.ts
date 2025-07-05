// /api/perfil/index.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

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

      // Retornar objeto combinado com email e dados do perfil
      return res.status(200).json({
        email: userReturn.email,
        ...userReturn.profile,
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
        cpf,
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

      const perfilAtualizado = await prisma.userProfile.update({
        where: { id: userAtt.profile.id },
        data: {
          fullName: nome,
          telefone,
          cpf,
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
