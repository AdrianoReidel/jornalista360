// components/NovaPostagemModal.tsx
"use client";

import React from "react";

interface NovaPostagemModalProps {
  onClose: () => void;
}

export default function NovaPostagemModal({ onClose }: NovaPostagemModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
      <div className="bg-white p-6 rounded-lg w-[80vw] h-[80vh] flex flex-col">
        {/* Conteúdo vazio por enquanto */}

        <div className="flex-grow">Nova Postagem</div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
