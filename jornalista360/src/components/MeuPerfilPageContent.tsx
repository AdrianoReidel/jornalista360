"use client";

import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { House, Pencil } from "lucide-react";
import NovaPostagemModal from "./NovaPostagemModal";
import ModalCadastro from "./ModalCadastro";
import Image from "next/image";

interface UsuarioDados {
  nome: string;
  senha: string;
  email: string;
  telefone: string;
  cpf: string;
  idade: string;
  linkedin: string;
  curriculoLattes: string;
  fotoFile: File | null;
  biografia: string;
  tipoUsuario: string;
  fotoUrl?: string;
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
}

export default function MeuPerfilPageContent() {
  const [modalNovaPostagemAberta, setModalNovaPostagemAberta] = useState(false);
  const [modalEditarPerfilAberta, setModalEditarPerfilAberta] = useState(false);
  const [usuarioDados, setUsuarioDados] = useState<UsuarioDados>({
    nome: "",
    senha: "",
    email: "",
    telefone: "",
    cpf: "",
    idade: "",
    linkedin: "",
    curriculoLattes: "",
    fotoFile: null,
    biografia: "",
    tipoUsuario: "ALUNO",
  });
  const [projetos, setProjetos] = useState<Projeto[]>([]);

  const getPreviewContent = (projeto: Projeto): { type: "image" | "youtube" | "pdf"; url: string } | null => {
    if (projeto.imagens?.length > 0) return { type: "image", url: projeto.imagens[0] };
    if (projeto.youtubeLinks?.length > 0) {
      const videoId = projeto.youtubeLinks[0].split("v=")[1]?.split("&")[0] ?? projeto.youtubeLinks[0];
      return { type: "youtube", url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` };
    }
    if (projeto.pdfs?.length > 0) return { type: "pdf", url: projeto.pdfs[0] };
    return null;
  };

  const fetchPerfil = async () => {
    const res = await fetch("/api/perfil");
    const data = await res.json();
    if (data) {
      setUsuarioDados((prev) => ({
        ...prev,
        nome: data.fullName || "",
        email: data.email || "",
        telefone: data.telefone || "",
        cpf: data.cpf || "",
        idade: data.idade?.toString() || "",
        linkedin: data.linkedin || "",
        curriculoLattes: data.curriculoLattes || "",
        biografia: data.biografia || "",
        tipoUsuario: data.tipoUsuario || "ALUNO",
        fotoUrl: data.fotoUrl || "",
      }));

      if (data.projetos) {
        setProjetos(data.projetos);
      }
    }
  };

  useEffect(() => {
    fetchPerfil();
  }, []);

  const handleCloseModal = () => {
    setModalNovaPostagemAberta(false);
    fetchPerfil();
  };

  const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUsuarioDados((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="relative bg-white rounded-lg p-6 w-[90vw] h-[90vh] flex flex-col">
          <h2 className="text-4xl font-bold mb-2 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            Jornalista 360
            <div className="text-xl font-semibold mt-1">Meu Perfil</div>
          </h2>
          <div className="flex-grow overflow-auto grid grid-cols-4 gap-4 p-4">
            {/* Coluna Esquerda */}
            <div className="col-span-1 border rounded p-4 bg-gray-50 flex flex-col items-start">
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
                <button
                  onClick={() => setModalEditarPerfilAberta(true)}
                  className="px-3 py-1 flex items-center gap-2 border rounded hover:bg-gray-100"
                >
                  <Pencil className="w-4 h-4" /> Editar
                </button>
              </div>
              <div className="text-lg font-semibold">{usuarioDados.nome}</div>
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

            {/* Coluna Direita - por enquanto em branco */}
            <div className="col-span-3 border rounded p-4 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projetos.map((projeto) => {
                  const preview = getPreviewContent(projeto);

                  return (
                    <div key={projeto.id} className="border rounded shadow p-2 bg-white h-70 overflow-hidden flex flex-col relative">

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
                        Criado em {new Date(projeto.dataCriacao).toLocaleDateString("pt-BR")}
                      </div>
                      <div className="text-xs text-gray-500 font-semibold">
                        Contém {projeto.tipo}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
          <div className="absolute top-6 right-6 flex gap-4">
            <button
              onClick={() => setModalNovaPostagemAberta(true)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              + Nova postagem
            </button>

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
          </div>
        </div>
      </div>

      {modalNovaPostagemAberta && (
        <NovaPostagemModal  onClose={handleCloseModal} />
      )}

      {modalEditarPerfilAberta && (
        <ModalCadastro
          usuarioDados={usuarioDados}
          setUsuarioDados={setUsuarioDados}
          handleUsuarioChange={handleUsuarioChange}
          fecharModalCadastro={() => setModalEditarPerfilAberta(false)}
        />
      )}
    </>
  );
}
