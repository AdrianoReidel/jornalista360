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
        return res
          .status(400)
          .json({ error: "Título e tipo são obrigatórios" });
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
        return res
          .status(404)
          .json({ error: "Usuário ou perfil não encontrado" });
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

  // --- ATUALIZAÇÃO DE PROJETO (PUT) ---
  if (req.method === "PUT") {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    try {
      const {
        id,
        titulo,
        descricao,
        tipo,
        imagens = [],
        pdfs = [],
        youtubeLinks = [],
      } = req.body;

      if (!id || !titulo || !tipo) {
        return res
          .status(400)
          .json({ error: "ID, título e tipo são obrigatórios" });
      }

      // Verifica se o projeto existe
      const projetoExistente = await prisma.projeto.findUnique({
        where: { id },
      });

      if (!projetoExistente) {
        return res.status(404).json({ error: "Projeto não encontrado" });
      }

      // Remove arquivos antigos vinculados a este projeto
      await prisma.arquivo.deleteMany({
        where: { projetoId: id },
      });

      // Atualiza o projeto e recria os arquivos
      const projetoAtualizado = await prisma.projeto.update({
        where: { id },
        data: {
          titulo,
          descricao,
          tipo,
          arquivos: {
            create: [
              ...imagens.map((url: string) => ({ url, tipo: "FOTO" })),
              ...pdfs.map((url: string) => ({ url, tipo: "PDF" })),
              ...youtubeLinks.map((url: string) => ({ url, tipo: "VIDEO" })),
            ],
          },
        },
        include: {
          arquivos: true,
          usuario: {
            include: {
              user: true,
            },
          },
        },
      });

      return res.status(200).json(projetoAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);
      return res.status(500).json({ error: "Erro ao atualizar projeto" });
    }
  }

  // --- LISTAGEM DE PROJETOS (GET) ---
  if (req.method === "GET") {
    try {
      const search = req.query?.search?.toString().trim().toLowerCase() ?? "";
      const type = req.query?.type?.toString().trim().toUpperCase(); // espera algo como 'VIDEO'

      const projetos: ProjetoComIncludes[] = await prisma.projeto.findMany({
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

      // Filtra por search (título ou nome do usuário)
      let projetosFiltrados = search
        ? projetos.filter((projeto) => {
            const titulo = projeto.titulo?.toLowerCase() ?? "";
            const nomeUsuario =
              projeto.usuario?.user?.name?.toLowerCase() ?? "";
            return titulo.includes(search) || nomeUsuario.includes(search);
          })
        : projetos;

      // Filtra por tipo, se o filtro for válido
      const tiposValidos = ["MULTIMIDIA", "TEXTO", "VIDEO", "FOTOS"];
      if (type && tiposValidos.includes(type)) {
        projetosFiltrados = projetosFiltrados.filter(
          (projeto) => projeto.tipo === type
        );
      }

      const projetosFormatados = projetosFiltrados.map((projeto) => {
        const arquivos = projeto.arquivos ?? [];
        return {
          id: projeto.id,
          titulo: projeto.titulo,
          descricao: projeto.descricao,
          tipo: projeto.tipo,
          dataCriacao: projeto.dataCriacao,
          imagens: arquivos.filter((a) => a.tipo === "FOTO").map((a) => a.url),
          pdfs: arquivos.filter((a) => a.tipo === "PDF").map((a) => a.url),
          youtubeLinks: arquivos
            .filter((a) => a.tipo === "VIDEO")
            .map((a) => a.url),
          usuario: {
            id: projeto.usuario?.user?.id ?? "sem-id",
            name: projeto.usuario?.user?.name ?? "Usuário desconhecido",
          },
        };
      });

      return res.status(200).json(projetosFormatados);
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
      return res.status(500).json({ error: "Erro ao buscar projetos" });
    }
  }

  // --- DELETAR PROJETO (DELETE) ---
  if (req.method === "DELETE") {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: "ID do projeto é obrigatório" });
      }

      const projetoExistente = await prisma.projeto.findUnique({
        where: { id },
      });

      if (!projetoExistente) {
        return res.status(404).json({ error: "Projeto não encontrado" });
      }

      // Deletar todos os arquivos associados ao projeto
      await prisma.arquivo.deleteMany({
        where: { projetoId: id },
      });

      // Deletar o projeto
      await prisma.projeto.delete({
        where: { id },
      });

      return res.status(200).json({ message: "Projeto deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar projeto:", error);
      return res.status(500).json({ error: "Erro ao deletar projeto" });
    }
  }

  return res.status(405).json({ error: "Método não permitido" });
}
