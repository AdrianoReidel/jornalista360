"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { House } from "lucide-react";
import NovaPostagemModal from "./NovaPostagemModal";

export default function MeuPerfilPageContent() {
  const [modalNovaPostagemAberta, setModalNovaPostagemAberta] = useState(false);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="relative bg-white rounded-lg p-6 w-[90vw] h-[90vh] flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-center">Meu Perfil</h2>

          <div className="flex-grow overflow-auto">
            <iframe
              src="https://res.cloudinary.com/dr0vswdzn/raw/upload/v1751598614/jornalista360/lphkidbav6rzqr2ozuxv.pdf"
              width="100%"
              height="600px"
            />

          </div>

          <div className="absolute bottom-6 right-6 flex gap-4">
            
            <button
              onClick={() => setModalNovaPostagemAberta(true)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              + Nova postagem
            </button>
            
            <button
              onClick={() => window.location.href = "/dashboard"}
              className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-100"
            >
              <House className="w-5 h-5" />
              Home
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
    </>
  );
}
