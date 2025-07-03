"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ModalLogin from "@/components/ModalLogin";
import ModalCadastro from "@/components/ModalCadastro";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  const [showLoginModal, setShowLoginModal] = useState(true);
  const [showCadastroModal, setShowCadastroModal] = useState(false);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [usuarioDados, setUsuarioDados] = useState({
    nome: "",
    senha: "",
    telefone: "",
    cpf: "",
    idade: "",
    linkedin: "",
    curriculoLattes: "",
    fotoFile: null as File | null,
    biografia: "",
    tipoUsuario: "ALUNO",
  });

  useEffect(() => {
    if (status === "authenticated") {
      // Se estiver logado, redireciona pra /dashboard
      router.push("/dashboard");
    }
  }, [status, router]);

  const abrirCadastro = () => {
    setShowLoginModal(false);
    setShowCadastroModal(true);
  };

  const fecharModalCadastro = () => {
    setShowCadastroModal(false);
    setShowLoginModal(true);
  };

  const handleUsuarioChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUsuarioDados((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Se estiver carregando status, pode mostrar algo ou nada
  if (status === "loading") {
    return <p>Carregando...</p>;
  }

  // Se estiver autenticado, nem precisa mostrar o modal (vai redirecionar)
  if (status === "authenticated") {
    return null; // ou uma tela loading simples
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/background-jornal.jpg')" }}
      ></div>

      {showLoginModal && (
        <ModalLogin
          email={email}
          senha={senha}
          setEmail={setEmail}
          setSenha={setSenha}
          abrirCadastro={abrirCadastro}
          onEntrar={() => alert("Entrar (a implementar)")}
        />
      )}

      {showCadastroModal && (
        <ModalCadastro
          usuarioDados={usuarioDados}
          setUsuarioDados={setUsuarioDados}
          handleUsuarioChange={handleUsuarioChange}
          fecharModalCadastro={fecharModalCadastro}
        />
      )}
    </>
  );
}
