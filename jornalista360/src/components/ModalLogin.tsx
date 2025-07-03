// components/ModalLogin.tsx
"use client";

import React from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";

interface ModalLoginProps {
  email: string;
  senha: string;
  setEmail: (value: string) => void;
  setSenha: (value: string) => void;
  abrirCadastro: () => void;
  onEntrar: () => void;
}

export default function ModalLogin({
  email,
  senha,
  setEmail,
  setSenha,
  abrirCadastro,
  onEntrar,
}: ModalLoginProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[350px]">
        <h2 className="text-xl font-semibold mb-4 text-center">Entrar</h2>

        <label className="block mb-2">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium">Senha</span>
          <input
            type="password"
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
          />
        </label>

        <button
          onClick={onEntrar}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          Entrar
        </button>
        <button
          onClick={() => signIn("google")}
          className="w-full mt-4 border border-gray-300 hover:bg-gray-100 text-gray-800 py-2 rounded transition flex items-center justify-center gap-2"
        >
          <Image src="/google.svg" className="w-5 h-5" alt="Google" width={20} height={20} />
          Continuar com Google
        </button>

        <p className="mt-4 text-center text-sm">
          Não tem conta? {" "}
          <button
            onClick={abrirCadastro}
            className="text-blue-600 hover:underline font-semibold"
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
}