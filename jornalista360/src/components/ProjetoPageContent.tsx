"use client";

import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { House } from "lucide-react";
import Image from "next/image";
import ModalVisualizacaoAnexo from "./ModalVisualizacaoAnexo";
import ImageGalleryModal from "./ImageGalleryModal";

interface UsuarioDados {
  nome: string;
  senha: string;
  email: string;
  telefone: string;
  idade: string;
  linkedin: string;
  curriculoLattes: string;
  fotoFile: File | null;
  biografia: string;
  tipoUsuario: string;
  fotoUrl?: string;
}

interface Arquivo {
  url: string;
  tipo: "FOTO" | "VIDEO" | "PDF";
}

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
  arquivos: Arquivo[];
}


interface ProjetoPageContentProps {
  projetoId: string;
}

export default function ProjetoPageContent({ projetoId }: ProjetoPageContentProps) {
  const [modalAberta, setModalAberta] = useState(false);
  const [anexoUrl, setAnexoUrl] = useState("");
  const [anexoTipo, setAnexoTipo] = useState<"imagem" | "pdf" | "video" | null>(null);
  const [modalImagensAberta, setModalImagensAberta] = useState(false);
  const [indexImagemAtual, setIndexImagemAtual] = useState(0);

  const [usuarioDados, setUsuarioDados] = useState<UsuarioDados>({
    nome: "",
    senha: "",
    email: "",
    telefone: "",
    idade: "",
    linkedin: "",
    curriculoLattes: "",
    fotoFile: null,
    biografia: "",
    tipoUsuario: "ALUNO",
  });
  const [projetos, setProjetos] = useState<Projeto[]>([]);

  const abrirAnexo = (url: string, tipo: "imagem" | "pdf" | "video") => {
    setAnexoUrl(url);
    setAnexoTipo(tipo);
    setModalAberta(true);
  };

  useEffect(() => {
    const fetchProjeto = async () => {
      const res = await fetch(`/api/projeto-page?id=${projetoId}`);
      const { projeto, usuario } = await res.json();

      if (usuario) {
        setUsuarioDados((prev) => ({
          ...prev,
          nome: usuario.nome || "",
          email: usuario.email || "",
          telefone: usuario.telefone || "",
          idade: usuario.idade?.toString() || "",
          linkedin: usuario.linkedin || "",
          curriculoLattes: usuario.curriculoLattes || "",
          biografia: usuario.biografia || "",
          tipoUsuario: usuario.tipoUsuario || "ALUNO",
          fotoUrl: usuario.fotoUrl || "",
        }));

        if (projeto) {
          setProjetos([projeto]);
        }
      }
    };

    fetchProjeto();
  }, [projetoId]);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="relative bg-white rounded-lg p-6 w-[90vw] h-[90vh] flex flex-col">
          <h2 className="text-4xl font-bold mb-2 text-left" style={{ fontFamily: "'Playfair Display', serif" }}>
            Jornalista 360
            <div className="text-xl font-semibold mt-1">Projeto</div>
          </h2>
          <div className="flex-grow overflow-auto grid grid-cols-4 gap-4 p-4">
            {/* Coluna Esquerda */}
            
            <div className="col-span-1 border rounded p-4 bg-gray-50 overflow-y-auto max-h-[calc(100vh-200px)] items-start">
              <div className="w-full flex items-center justify-between mb-4">
                {usuarioDados.fotoUrl && (
                  <Image
                    src={usuarioDados.fotoUrl}
                    alt="Foto do usuário"
                    width={100}
                    height={100}
                    className="rounded-full object-cover"
                  />
                )}
              </div>
              <div className="text-lg font-semibold">Publicado por {usuarioDados.nome}</div>
              <div className="text-sm text-gray-600 mb-4">{usuarioDados.email}</div>
              {usuarioDados.idade && (
                <div className="text-sm mb-2">
                  <span className="font-medium">Idade:</span> {usuarioDados.idade}
                </div>
              )}
              <div className="text-sm mb-2">
                <span className="font-medium">Formação / Profissão:</span> {usuarioDados.tipoUsuario}
              </div>
              {usuarioDados.linkedin && (
                <div className="text-sm mb-2">
                  <a
                    href={usuarioDados.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    LinkedIn
                  </a>
                </div>
              )}

              {usuarioDados.curriculoLattes && (
                <div className="text-sm mb-2">
                  <a
                    href={usuarioDados.curriculoLattes}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Currículo Lattes
                  </a>
                </div>
              )}
              
              <div className="text-sm mb-2">
                {usuarioDados.biografia ? usuarioDados.biografia : "Sem biografia"}
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="col-span-3 border rounded p-4 bg-white overflow-y-auto max-h-[calc(100vh-200px)]">
              <h2 className="text-2xl font-bold mb-2 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                {projetos[0]?.titulo || "Carregando..."}
                <div className="text-xl font-semibold mt-1">{projetos[0]?.descricao || "Descrição do projeto"}</div>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Coluna de Imagens */}
              <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
                <h3 className="text-sm font-semibold text-gray-600">Imagens</h3>
                {projetos[0]?.imagens?.length > 0 ? (
                  projetos[0].imagens.map((url, idx) => (
                    <Image
                      key={idx}
                      src={url}
                      alt={`Imagem ${idx + 1}`}
                      width={200}
                      height={200}
                      className="rounded object-cover w-full h-[200px] cursor-pointer"
                      onClick={() => {
                        setIndexImagemAtual(idx);
                        setModalImagensAberta(true);
                      }}
                    />
                  ))
                ) : (
                  <div className="text-xs text-gray-500">Sem imagens</div>
                )}
              </div>


              {/* Coluna de PDFs */}
              <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
                <h3 className="text-sm font-semibold text-gray-600">PDFs</h3>
                {projetos[0]?.pdfs?.length > 0 ? (
                  projetos[0].pdfs.map((url, idx) => (
                    <div
                      key={idx}
                      onClick={() => abrirAnexo(url, "pdf")}
                      className="relative cursor-pointer"
                    >
                      <iframe
                        src={url}
                        className="w-full h-[200px] rounded border pointer-events-none"
                        title={`PDF ${idx + 1}`}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-500">Sem PDFs</div>
                )}
              </div>

              {/* Coluna de Vídeos */}
              <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
                <h3 className="text-sm font-semibold text-gray-600">Vídeos</h3>
                {projetos[0]?.youtubeLinks?.length > 0 ? (
                  projetos[0].youtubeLinks.map((url, idx) => {
                    const videoId = url.includes("v=")
                      ? url.split("v=")[1]?.split("&")[0]
                      : url.split("/").pop();
                    const thumb = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

                    return (
                      <Image
                        key={idx}
                        src={thumb}
                        alt={`Vídeo ${idx + 1}`}
                        width={200}
                        height={200}
                        className="rounded object-cover w-full h-[200px] cursor-pointer"
                        onClick={() => abrirAnexo(url, "video")}
                      />
                    );
                  })
                ) : (
                  <div className="text-xs text-gray-500">Sem vídeos</div>
                )}
              </div>
            </div>

            </div>
          </div>
          <div className="absolute top-6 right-6 flex gap-4">
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-100"
            >
              <House className="w-5 h-5" /> Home
            </button>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Sair
            </button>

            {modalAberta && anexoTipo && (
              <ModalVisualizacaoAnexo
                url={anexoUrl}
                tipo={anexoTipo}
                onClose={() => setModalAberta(false)}
              />
            )}
            {modalImagensAberta && (
              <ImageGalleryModal
                imagens={projetos[0].imagens}
                indexAtual={indexImagemAtual}
                onClose={() => setModalImagensAberta(false)}
              />
            )}

          </div>
        </div>
      </div>
    </>
  );
}
