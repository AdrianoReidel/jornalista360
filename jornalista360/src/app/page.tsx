"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ModalLogin from "@/components/ModalLogin";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  const [showLoginModal] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      // Se estiver logado, redireciona pra /dashboard
      router.push("/dashboard");
    }
  }, [status, router]);

  // Se estiver carregando status, pode mostrar algo ou nada
  if (status === "loading") {
    return <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/background-jornal-pages.png')" }}
      ></div>;
  }

  // Se estiver autenticado, nem precisa mostrar o modal (vai redirecionar)
  if (status === "authenticated") {
    return <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/background-jornal-pages.png')" }}
      ></div>; // ou uma tela loading simples
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/background-jornal-pages.png')" }}
      ></div>

      {showLoginModal && (
        <ModalLogin/>
      )}
    </>
  );
}
