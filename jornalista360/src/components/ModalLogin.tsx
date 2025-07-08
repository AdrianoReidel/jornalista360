// components/ModalLogin.tsx
"use client";

import React from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function ModalLogin() {
  return (
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div className="bg-white rounded-lg p-10 w-[800px] max-w-full space-y-10 text-left">
    
    <div>
      <Image
        src="/logo.png"
        alt="Logo Jornalista360"
        width={500}
        height={500}
        className="mx-auto mb-4"
      />
      <h1 className="text-4xl font-extrabold text-gray-800 mb-4 leading-tight">
        Bem-vindo!
      </h1>
      <p className="text-lg text-gray-700 mb-4 leading-relaxed">
        Esta é a sua plataforma de portfólio, criada especialmente para estudantes de Jornalismo.
        Aqui, você pode compartilhar seus projetos com o mundo: publique seus textos, fotos, vídeos
        ou combine tudo em um único projeto multimídia.
        <br /><br />
        O Jornalista360 é o espaço ideal para mostrar seu talento, acompanhar seu crescimento
        e criar conexões com outros futuros profissionais da área.
      </p>
      <p className="text-lg text-gray-700 leading-relaxed">
        Professores e recrutadores também são sempre bem-vindos! Aqui, é possível acompanhar a evolução dos alunos, descobrir novos talentos e se conectar com a próxima geração do jornalismo brasileiro.
      </p>
    </div>

    <div>
      <h2 className="text-lg text-gray-700 leading-relaxed font-semibold text-center items-center justify-center mb-2">Entre ou cadastre-se</h2>
      <button
        onClick={() => signIn("google")}
        className="w-[300px] mx-auto border border-gray-300 hover:bg-gray-100 text-gray-800 py-3 rounded transition flex text-center items-center justify-center gap-2 text-lg"
      >
        <Image src="/google.svg" className="w-5 h-5" alt="Google" width={20} height={20} />
        Acessar com Google
      </button>
    </div>

  </div>
</div>


  );
}