"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ModalProps {
  url: string;
  tipo: "imagem" | "pdf" | "video";
  onClose: () => void;
}

export default function ModalVisualizacaoAnexo({ url, tipo, onClose }: ModalProps) {
  const renderContent = () => {
    if (tipo === "imagem") {
      return (
        <Image
          src={url}
          alt="Imagem ampliada"
          width={800}
          height={800}
          className="max-w-full max-h-[80vh] object-contain rounded"
        />
      );
    }

    if (tipo === "pdf") {
      return (
        <iframe
          src={url}
          className="w-full h-[80vh] rounded border"
          title="Visualização do PDF"
        />
      );
    }

    if (tipo === "video") {
      const videoId = url.includes("v=")
        ? url.split("v=")[1]?.split("&")[0]
        : url.split("/").pop(); // fallback para youtu.be

      return (
        <iframe
          className="w-full h-[80vh] rounded"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allowFullScreen
        />
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-4 rounded max-w-4xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80"
        >
          <X size={24} />
        </button>
        {renderContent()}
      </div>
    </div>
  );
}
