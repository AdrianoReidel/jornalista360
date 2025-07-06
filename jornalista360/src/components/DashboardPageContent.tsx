import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { User } from "lucide-react";
import NovaPostagemModal from "./NovaPostagemModal";
import Image from "next/image";

interface Projeto {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  dataCriacao: string;
  imagens: string[];
  pdfs: string[];
  youtubeLinks: string[];
  usuario: {
    id: string;
    name: string;
  };
}

export default function DashboardPageContent() {
  const [modalNovaPostagemAberta, setModalNovaPostagemAberta] = useState(false);
  const [projetos, setProjetos] = useState<Projeto[]>([]);

  const fetchProjetos = async () => {
    const res = await fetch("/api/projetos");
    const data = await res.json();
    setProjetos(data);
  };

  useEffect(() => {
    fetchProjetos();
  }, []);

  const getPreviewContent = (projeto: Projeto): { type: "image" | "youtube" | "pdf"; url: string } | null => {
    if (projeto.imagens?.length > 0) return { type: "image", url: projeto.imagens[0] };

    if (projeto.youtubeLinks?.length > 0) {
      const videoId = projeto.youtubeLinks[0].split("v=")[1]?.split("&")[0] ?? projeto.youtubeLinks[0];
      return { type: "youtube", url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` };
    }

    if (projeto.pdfs?.length > 0) return { type: "pdf", url: projeto.pdfs[0] };

    return null;
  };

  const handleCloseModal = () => {
    setModalNovaPostagemAberta(false);
    fetchProjetos(); // Atualiza os projetos ao fechar o modal
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="relative bg-white rounded-lg p-6 w-[90vw] h-[90vh] flex flex-col">
          <h2
            className="text-4xl font-bold mb-4 text-left"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Jornalista 360
            <div className="text-xl font-semibold mt-1">Feed de projetos</div>
          </h2>
          <div className="flex-grow overflow-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projetos.map((projeto) => {
              const preview = getPreviewContent(projeto);

              return (
                <div key={projeto.id} className="border rounded shadow p-2 bg-white h-70 overflow-hidden flex flex-col">
                  {preview?.type === "image" && (
                  <Image
                    src={preview.url}
                    alt="Imagem do projeto"
                    width={400}
                    height={400}
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                )}

                {preview?.type === "youtube" && (
                  <Image
                    src={preview.url}
                    alt="Thumbnail do vídeo"
                    width={400}
                    height={400}
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                )}

                {preview?.type === "pdf" && (
                  <iframe
                    src={preview.url}
                    className="w-full h-48 rounded mb-2 border"
                    title="Visualização do PDF"
                  />
                )}
                  <div className="text-sm font-bold">{projeto.titulo}</div>
                  <div className="text-xs text-gray-500 font-semibold mb-1">
                    por {projeto.usuario?.name || "Desconhecido"} em{" "}
                    {new Date(projeto.dataCriacao).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="text-xs text-gray-500 font-semibold">
                    Projeto contém {projeto.tipo}, acesse para ver mais.
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute top-6 right-6 flex gap-4">
            <button
              onClick={() => setModalNovaPostagemAberta(true)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              + Nova postagem
            </button>

            <button
              onClick={() => (window.location.href = "/meu-perfil")}
              className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-100"
            >
              <User className="w-5 h-5" />
              Perfil
            </button>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      {modalNovaPostagemAberta && <NovaPostagemModal onClose={handleCloseModal} />}
    </>
  );
}
