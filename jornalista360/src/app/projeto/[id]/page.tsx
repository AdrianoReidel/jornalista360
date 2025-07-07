import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TipoArquivo } from "@prisma/client";
import ProjetoPageContent from "@/components/ProjetoPageContent";

type PageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: { params: Promise<PageProps['params']> }): Promise<Metadata> {
  const { id } = await params;
  
  const projetoId = parseInt(id, 10);

  const projeto = await prisma.projeto.findUnique({
    where: { id: projetoId },
    select: {
      titulo: true,
      usuario: {
        select: {
          fullName: true,
        },
      },
      arquivos: {
        select: {
          url: true,
          tipo: true,
        },
      },
    },
  });

  if (!projeto) return notFound();

  const { titulo, usuario, arquivos } = projeto;

  function gerarThumbnailYoutube(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/);
    const videoId = match?.[1];
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : null;
  }

  const imagemFoto = arquivos.find((arq: { tipo: TipoArquivo }) => arq.tipo === "FOTO");
  const imagemVideo = arquivos.find((arq: { tipo: TipoArquivo }) => arq.tipo === "VIDEO");

  let imagemPreview: string = "/logo-share-default.jpg";

  if (imagemFoto) {
    imagemPreview = imagemFoto.url;
  } else if (imagemVideo) {
    if (imagemVideo.url.includes("youtube.com") || imagemVideo.url.includes("youtu.be")) {
      const thumb = gerarThumbnailYoutube(imagemVideo.url);
      if (thumb) imagemPreview = thumb;
    } else {
      imagemPreview = imagemVideo.url;
    }
  }

  return {
    title: `Jornalista360 | ${titulo}`,
    description: `Projeto de ${usuario?.fullName || "Usuário desconhecido"} no Jornalista360.`,
    openGraph: {
      title: `Jornalista360 | ${titulo}`,
      description: `Projeto de ${usuario?.fullName || "Usuário desconhecido"} no Jornalista360.`,
      images: [imagemPreview],
    },
  };
}

export default async function ProjetoPage({ params }: { params: Promise<PageProps['params']> }) {
  const { id } = await params;
  return (
    <div className="p-6 relative z-10">
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/background-jornal-pages.jpg')" }}
      ></div>
      <ProjetoPageContent projetoId={id} />
    </div>
  );
}

