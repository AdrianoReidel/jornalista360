"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MeuPerfilPageContent from "@/components/MeuPerfilPageContent";

export default function MeuPerfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Se não estiver logado, redireciona para home
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/background-jornal-pages.png')" }}
      ></div>;
  }

  if (!session) {
    return <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/background-jornal-pages.png')" }}
      ></div>; // Ou loading simples
  }

  return (
    <div className="p-6">
      <>
        <div
          className="fixed inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/background-jornal-pages.png')" }}
        ></div>
        <MeuPerfilPageContent/>
      </>
    </div>
  );
}
