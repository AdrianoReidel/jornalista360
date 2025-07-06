"use client";

import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { House, Pencil, Trash2 } from "lucide-react";
import NovaPostagemModal from "./NovaPostagemModal";
import ModalCadastro from "./ModalCadastro";
import Image from "next/image";
import EditarPostagemModal from "./EditarPostagemModal";
import api from "@/lib/api";

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
  const [modalEditarPostagemAberta, setModalEditarPostagemAberta] = useState(false);
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
  const [projetoEditar, setProjetoEditar] = useState<Projeto | null>(null);

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

  const handleCloseModalEditar = () => {
    setModalEditarPostagemAberta(false);
    fetchPerfil();
  };

  const editarPostagem = (id: string) => {
    setModalEditarPostagemAberta(true);
    const projeto = projetos.find((p) => p.id === id);
    setProjetoEditar(projeto || null);
  };

  const [modalExclusaoAberta, setModalExclusaoAberta] = useState(false);
  const [projetoParaExcluir, setProjetoParaExcluir] = useState<string | null>(null);

  const confirmarExclusao = async () => {
    if (!projetoParaExcluir) return;

    try {
      await api.delete("/projetos", {
        data: { id: projetoParaExcluir },
      });
      setModalExclusaoAberta(false);
      setProjetoParaExcluir(null);
      fetchPerfil();
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  const abrirModalExclusao = (id: string) => {
    setProjetoParaExcluir(id);
    setModalExclusaoAberta(true);
  };


  const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUsuarioDados((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="relative bg-white rounded-lg p-6 w-[90vw] h-[90vh] flex flex-col">
          <h2 className="text-4xl font-bold mb-2 text-left" style={{ fontFamily: "'Playfair Display', serif" }}>
            Jornalista 360
            <div className="text-xl font-semibold mt-1">Meu Perfil</div>
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

            {/* Coluna Direita*/}
            <div className="col-span-3 border rounded p-4 bg-white overflow-y-auto max-h-[calc(100vh-200px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projetos.map((projeto) => {
                  const preview = getPreviewContent(projeto);

                  return (
                    <div
                      key={projeto.id}
                      className="border rounded shadow p-2 bg-white h-70 overflow-hidden flex flex-col relative"
                    >
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

                      {/* Informações do projeto */}
                      <div className="text-sm font-bold">{projeto.titulo}</div>
                      {/* Linha: Criado em + Ações */}
                      <div className="flex justify-between items-center text-xs text-gray-500 font-semibold mb-1">
                        <span>
                          Criado em {new Date(projeto.dataCriacao).toLocaleDateString("pt-BR")}
                        </span>
                        <div className="flex gap-2">
                          <button
                            title="Editar projeto"
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => editarPostagem(projeto.id)}
                          >
                            <Pencil size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs text-gray-500 font-semibold mb-1">
                        <span>
                          Contém {projeto.tipo}
                        </span>
                        <div className="flex gap-2">
                          <button
                            title="Excluir projeto"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => abrirModalExclusao(projeto.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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

      {modalEditarPostagemAberta && (
        <EditarPostagemModal projeto={projetoEditar} onClose={handleCloseModalEditar} />
      )}

      {modalEditarPerfilAberta && (
        <ModalCadastro
          usuarioDados={usuarioDados}
          setUsuarioDados={setUsuarioDados}
          handleUsuarioChange={handleUsuarioChange}
          fecharModalCadastro={() => setModalEditarPerfilAberta(false)}
        />
      )}

      {modalExclusaoAberta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">Tem certeza que deseja excluir?</h2>
            <p className="text-sm text-gray-700 mb-6">Esta ação não poderá ser desfeita.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setModalExclusaoAberta(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExclusao}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
