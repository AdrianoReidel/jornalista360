import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  try {
    const { titulo, descricao, tipo, imagens, pdfs, youtubeLinks } = req.body;

    if (!titulo || !tipo) {
      return res.status(400).json({ error: "Título e tipo são obrigatórios" });
    }

    // Busca o usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true },
    });

    // Se o usuário foi criado agora ou já existia, checa se o perfil está ausente
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

        // Conecta o novo perfil ao usuário
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
      return res
        .status(404)
        .json({ error: "Usuário ou perfil não encontrado" });
    }

    // Cria o projeto vinculado ao UserProfile (usuarioId)
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
        usuario: true,
      },
    });

    return res.status(201).json(projetoCriado);
  } catch (error) {
    console.error("Erro ao criar projeto:", error);
    return res.status(500).json({ error: "Erro ao criar projeto" });
  }
}
