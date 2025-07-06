// components/ModalCadastro.tsx
"use client";

import React from "react";
import { toast } from "sonner";

interface UsuarioDados {
  nome: string;
  senha: string;
  email: string;
  telefone: string;
  fotoFile: File | null;
  idade: string;
  linkedin: string;
  curriculoLattes: string;
  biografia: string;
  tipoUsuario: string;
}

interface ModalCadastroProps {
  usuarioDados: UsuarioDados;
  setUsuarioDados: React.Dispatch<React.SetStateAction<UsuarioDados>>;
  handleUsuarioChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void;
  fecharModalCadastro: () => void;
}

export default function ModalCadastro({
  usuarioDados,
  handleUsuarioChange,
  fecharModalCadastro,
}: ModalCadastroProps) {
  const atualizarPerfil = async () => {
    const res = await fetch("/api/perfil", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: usuarioDados.nome,
        telefone: usuarioDados.telefone,
        idade: usuarioDados.idade,
        linkedin: usuarioDados.linkedin,
        curriculoLattes: usuarioDados.curriculoLattes,
        biografia: usuarioDados.biografia,
        tipoUsuario: usuarioDados.tipoUsuario,
      }),
    });

    if (!res.ok) throw new Error("Erro na atualização");

    return res.json();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-[80vw] max-h-[95vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-3 text-center">Edite seus dados</h2>

        <form
           onSubmit={(e) => {
            e.preventDefault();

            const promise = atualizarPerfil();

            toast.promise(promise, {
              loading: "Salvando alterações...",
              success: "Dados atualizados com sucesso!",
              error: "Erro ao atualizar dados. Tente novamente.",
            });

            promise.then(() => {
              fecharModalCadastro();
            });
          }}
        >
          {/* Nome e Email na mesma linha */}
          <div className="grid grid-cols-2 gap-4 mb-3">
            <label>
              <span className="text-sm font-medium">Nome</span>
              <input
                type="text"
                name="nome"
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                value={usuarioDados.nome}
                onChange={handleUsuarioChange}
                required
              />
            </label>
            <label>
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                value={usuarioDados.email}
                onChange={handleUsuarioChange}
                disabled
              />
            </label>
          </div>

          {/* Telefone, Idade na mesma linha */}
          <div className="grid grid-cols-3 gap-4 mb-3">
            <label>
              <span className="text-sm font-medium">Telefone</span>
              <input
                type="tel"
                name="telefone"
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                value={usuarioDados.telefone}
                onChange={handleUsuarioChange}
              />
            </label>
            <label>
              <span className="text-sm font-medium">Idade</span>
              <input
                type="number"
                name="idade"
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                value={usuarioDados.idade}
                onChange={handleUsuarioChange}
                min={0}
              />
            </label>
          </div>

          {/* LinkedIn e Currículo Lattes na mesma linha */}
          <div className="grid grid-cols-2 gap-4 mb-3">
            <label>
              <span className="text-sm font-medium">LinkedIn</span>
              <input
                type="url"
                name="linkedin"
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                value={usuarioDados.linkedin}
                onChange={handleUsuarioChange}
                placeholder="https://linkedin.com/in/..."
              />
            </label>
            <label>
              <span className="text-sm font-medium">Currículo Lattes</span>
              <input
                type="url"
                name="curriculoLattes"
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                value={usuarioDados.curriculoLattes}
                onChange={handleUsuarioChange}
                placeholder="https://lattes.cnpq.br/..."
              />
            </label>
          </div>

          {/* Biografia e tipo de usuário */}
          <label className="block mb-3">
            <span className="text-sm font-medium">Biografia</span>
            <textarea
              name="biografia"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 resize-none"
              rows={3}
              value={usuarioDados.biografia}
              onChange={handleUsuarioChange}
            />
          </label>

          <label className="block mb-5">
            <span className="text-sm font-medium">Qual a sua formação/profissão?</span>
            <select
              name="tipoUsuario"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
              value={usuarioDados.tipoUsuario}
              onChange={handleUsuarioChange}
            >
              <option value="ALUNO">Aluno</option>
              <option value="PROFESSOR">Professor</option>
              <option value="FORMADO">Formado</option>
              <option value="RECRUTADOR">Recrutador</option>
            </select>
          </label>

          <div className="flex justify-between mt-2">
            <button
              type="button"
              onClick={fecharModalCadastro}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Voltar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );

}
