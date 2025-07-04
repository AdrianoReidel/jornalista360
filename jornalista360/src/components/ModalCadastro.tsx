// components/ModalCadastro.tsx
"use client";

import React from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";

interface UsuarioDados {
  nome: string;
  senha: string;
  email: string;
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
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[350px]">
        <h2 className="text-xl font-semibold mb-6 text-center">Cadastre-se</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Usuário a cadastrar:", usuarioDados);
            alert("Cadastro enviado (a implementar)");
            fecharModalCadastro();
          }}
        >
          <label className="block mb-3">
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
          <label className="block mb-2">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
              value={usuarioDados.email}
              onChange={handleUsuarioChange}
              placeholder="seu@email.com"
            />
          </label>
  
          <label className="block mb-4">
            <span className="text-sm font-medium">Senha</span>
            <input
              type="password"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
              value={usuarioDados.senha}
              onChange={handleUsuarioChange}
              placeholder="Senha"
            />
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
              Cadastrar
            </button>
          </div>

          <button
            onClick={() => signIn("google")}
            className="w-full mt-4 border border-gray-300 hover:bg-gray-100 text-gray-800 py-2 rounded transition flex items-center justify-center gap-2"
          >
           <Image src="/google.svg" className="w-5 h-5" alt="Google" width={20} height={20} />
            ou Cadastrar com o Google
          </button>
        </form>
      </div>
    </div>
  );
}
