'use client';

import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface ImageGalleryModalProps {
  imagens: string[];
  indexAtual: number;
  onClose: () => void;
}

export default function ImageGalleryModal({
  imagens,
  indexAtual,
  onClose,
}: ImageGalleryModalProps) {
  const [index, setIndex] = React.useState(indexAtual);

  const imagemAtual = imagens[index];

  const irParaAnterior = () => {
    setIndex((prev) => (prev === 0 ? imagens.length - 1 : prev - 1));
  };

  const irParaProxima = () => {
    setIndex((prev) => (prev === imagens.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <Image
          src={imagemAtual}
          alt={`Imagem ${index + 1}`}
          width={1000}
          height={800}
          className="rounded object-contain max-w-full max-h-[80vh]"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80"
        >
          <X size={24} />
        </button>

        <button
          onClick={irParaAnterior}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-r p-2 hover:bg-opacity-80"
        >
          <ChevronLeft size={28} />
        </button>

        <button
          onClick={irParaProxima}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-l p-2 hover:bg-opacity-80"
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
}
