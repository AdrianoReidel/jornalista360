"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

interface NovaPostagemModalProps {
  onClose: () => void;
}

export default function NovaPostagemModal({ onClose }: NovaPostagemModalProps) {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  const [imagens, setImagens] = useState<File[]>([]);
  const [pdfs, setPdfs] = useState<File[]>([]);
  const [youtubeLinks, setYoutubeLinks] = useState<string[]>([]);
  const [novoYoutube, setNovoYoutube] = useState("");

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagens((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdfs((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removerArquivo = (index: number, tipo: "imagem" | "pdf") => {
    if (tipo === "imagem") {
      setImagens(imagens.filter((_, i) => i !== index));
    } else {
      setPdfs(pdfs.filter((_, i) => i !== index));
    }
  };

  const removerLink = (index: number) => {
    setYoutubeLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const adicionarLinkYoutube = () => { debugger
    if (novoYoutube.trim()) {
      setYoutubeLinks((prev) => [...prev, novoYoutube.trim()]);
      setNovoYoutube("");
    }
  };

  const uploadFileToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "jornalista360_preset");
    formData.append("folder", "jornalista360");

    // Detecta extensão do arquivo
    const isPdf = file.type === "application/pdf";

    const uploadUrl = isPdf
      ? "https://api.cloudinary.com/v1_1/dr0vswdzn/raw/upload"
      : "https://api.cloudinary.com/v1_1/dr0vswdzn/auto/upload";

    const res = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Erro ao fazer upload para Cloudinary");
    }

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim()) return toast.warning("Por favor, preencha o título.");
    if (!descricao.trim()) return toast.warning("Por favor, preencha a descrição.");

    const temImagem = imagens.length > 0;
    const temPdf = pdfs.length > 0;
    const temYoutube = youtubeLinks.length > 0;

    if (!temImagem && !temPdf && !temYoutube) {
      return toast.warning("Adicione pelo menos uma imagem, PDF ou link do YouTube.");
    }

    let urlsImagens: string[] = [];
    let urlsPdfs: string[] = [];

    await toast.promise(
      (async () => {
        try {
          if (temImagem) {
            const uploadPromises = imagens.map(uploadFileToCloudinary);
            urlsImagens = await Promise.all(uploadPromises);
          }

          if (temPdf) {
            const uploadPromises = pdfs.map(uploadFileToCloudinary);
            urlsPdfs = await Promise.all(uploadPromises);
          }

          let tipo = "MULTIMIDIA";
          const tipos = [temImagem, temPdf, temYoutube].filter(Boolean).length;
          if (tipos === 1) {
            if (temImagem) tipo = "FOTOS";
            else if (temPdf) tipo = "TEXTO";
            else if (temYoutube) tipo = "VIDEO";
          }

          await api.post("/projetos", {
            titulo,
            descricao,
            imagens: urlsImagens,
            pdfs: urlsPdfs,
            youtubeLinks,
            tipo,
          });
        } finally {
          onClose();
          router.push("/dashboard");
        }
      })(),
      {
        loading: "Enviando postagem...",
        success: "Postagem enviada com sucesso!",
        error: "Erro ao enviar postagem. Tente novamente.",
      }
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
      <div className="bg-white p-6 rounded-lg w-[60vw] h-[80vh] flex flex-col overflow-hidden">
        <h2 className="text-xl font-semibold mb-4">Nova Postagem</h2>

        <form onSubmit={handleSubmit} className="flex-grow overflow-auto space-y-4 pr-1">
          {/* Título e descrição */}
          <div className="border rounded p-4">
            <label className="block mb-3">
              <span className="text-sm font-medium">Título</span>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Descrição</span>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 resize-none"
                rows={3}
              />
            </label>

            <div className="mt-3 text-right">
              <button
                type="submit"
                onClick={handleSubmit}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Enviar Postagem
              </button>
            </div>
          </div>

          {/* Grid com 3 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Imagens */}
            <div className="border rounded p-4">
              <label className="block font-medium mb-2">📷 Fotografias</label>
              
              <input
                type="file"
                accept="image/*"
                multiple
                id="upload-imagens"
                onChange={handleImagemChange}
                className="hidden"
              />
              <label
                htmlFor="upload-imagens"
                className="cursor-pointer inline-block bg-gray-200 hover:bg-gray-300 text-sm text-gray-700 font-medium py-2 px-4 rounded"
              >
                Selecionar imagens
              </label>

              {imagens.length > 0 && (
                <ul className="mt-3 text-sm list-disc list-inside space-y-1">
                  {imagens.map((img, i) => (
                    <li key={i} className="flex items-center justify-between gap-2">
                      <span className="truncate">{img.name}</span>
                      <button
                        type="button"
                        onClick={() => removerArquivo(i, "imagem")}
                        className="text-red-500 hover:underline text-xs"
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* PDFs */}
            <div className="border rounded p-4">
              <label className="block font-medium mb-2">📄 Notícias, reportagens, artigos, entrevistas, ... </label>
              
              <input
                type="file"
                accept="application/pdf"
                multiple
                id="upload-pdfs"
                onChange={handlePdfChange}
                className="hidden"
              />
              <label
                htmlFor="upload-pdfs"
                className="cursor-pointer inline-block bg-gray-200 hover:bg-gray-300 text-sm text-gray-700 font-medium py-2 px-4 rounded"
              >
                Selecionar PDFs
              </label>

              {pdfs.length > 0 && (
                <ul className="mt-3 text-sm list-disc list-inside space-y-1">
                  {pdfs.map((pdf, i) => (
                    <li key={i} className="flex items-center justify-between gap-2">
                      <span className="truncate">{pdf.name}</span>
                      <button
                        type="button"
                        onClick={() => removerArquivo(i, "pdf")}
                        className="text-red-500 hover:underline text-xs"
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>


            {/* Vídeos YouTube */}
            <div className="border rounded p-4">
              <label className="block font-medium mb-2">🎥 Links do YouTube</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="url"
                  placeholder="https://youtube.com/..."
                  value={novoYoutube}
                  onChange={(e) => setNovoYoutube(e.target.value)}
                  className="flex-grow border border-gray-300 px-2 py-1 rounded"
                />
                <button
                  type="button"
                  onClick={adicionarLinkYoutube}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  +
                </button>
              </div>
              {youtubeLinks.length > 0 && (
                <ul className="mt-2 text-sm list-disc list-inside space-y-1">
                  {youtubeLinks.map((link, i) => (
                    <li key={i} className="flex items-center justify-between gap-2">
                      <span className="truncate">{link}</span>
                      <button
                        type="button"
                        onClick={() => removerLink(i)}
                        className="text-red-500 hover:underline text-xs"
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </form>

        {/* Ações */}
        <div className="flex justify-end mt-4 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
