"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import ProjetoPageContent from "@/components/ProjetoPageContent";

export default function ProjetoPage() {
  const { status } = useSession();
  const params = useParams();

  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  if (status === "loading") {
    return (
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/background-jornal-pages.jpg')" }}
      ></div>
    );
  }

  return (
    <div className="p-6 relative z-10">
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/background-jornal-pages.jpg')" }}
      ></div>
      <ProjetoPageContent projetoId={id} />
    </div>
  );
}
