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

  useEffect(() => {
    async function fetchPerfil() {
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
      }
    }
    fetchPerfil();
  }, []);

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
              {/* Conteúdo futuro pode ir aqui */}
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
        <NovaPostagemModal onClose={() => setModalNovaPostagemAberta(false)} />
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
