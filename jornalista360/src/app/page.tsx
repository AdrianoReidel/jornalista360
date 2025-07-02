"use client";

import { useState } from "react";

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [showCadastroModal, setShowCadastroModal] = useState(false);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [usuarioDados, setUsuarioDados] = useState({
    nome: "",
    telefone: "",
    cpf: "",
    idade: "",
    linkedin: "",
    curriculoLattes: "",
    fotoFile: null as File | null,
    biografia: "",
    tipoUsuario: "ALUNO",
  });


  const abrirCadastro = () => {
    setShowLoginModal(false);
    setShowCadastroModal(true);
  };

  const fecharModalCadastro = () => {
    setShowCadastroModal(false);
    setShowLoginModal(true);
  };

  const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUsuarioDados((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {/* Fundo com imagem cobrindo toda a tela */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/background-jornal.jpg')" }}
      >
        {/* <div className="absolute inset-0 bg-black bg-opacity-60" /> */}
      </div>
      {/* Modal Login */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[350px]">
            <h2 className="text-xl font-semibold mb-4 text-center">Entrar</h2>

            <label className="block mb-2">
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </label>

            <label className="block mb-4">
              <span className="text-sm font-medium">Senha</span>
              <input
                type="password"
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha"
              />
            </label>

            <button
              onClick={() => alert("Entrar (a implementar)")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
            >
              Entrar
            </button>

            <p className="mt-4 text-center text-sm">
              Não tem conta?{" "}
              <button
                onClick={abrirCadastro}
                className="text-blue-600 hover:underline font-semibold"
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Modal Cadastro completo */}
      {showCadastroModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-6 text-center">Cadastro Completo</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Usuário a cadastrar:", usuarioDados);
                alert("Cadastro enviado (a implementar)");
                fecharModalCadastro();
              }}
            >
              {/* campos do cadastro como antes... */}
              <label className="block mb-3">
                <span className="text-sm font-medium">Nome</span>
                <input
                  type="text"
                  name="nome"
                  className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                  value={usuarioDados.nome}
                  onChange={handleUsuarioChange}
                  required
                />
              </label>
              {/* ...restante dos inputs igual ao anterior */}
              <label className="block mb-3">
                <span className="text-sm font-medium">Telefone</span>
                <input
                  type="tel"
                  name="telefone"
                  className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                  value={usuarioDados.telefone}
                  onChange={handleUsuarioChange}
                />
              </label>

              <label className="block mb-3">
                <span className="text-sm font-medium">CPF</span>
                <input
                  type="text"
                  name="cpf"
                  className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                  value={usuarioDados.cpf}
                  onChange={handleUsuarioChange}
                />
              </label>

              <label className="block mb-3">
                <span className="text-sm font-medium">Idade</span>
                <input
                  type="number"
                  name="idade"
                  className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                  value={usuarioDados.idade}
                  onChange={handleUsuarioChange}
                  min={0}
                />
              </label>

              <label className="block mb-3">
                <span className="text-sm font-medium">LinkedIn</span>
                <input
                  type="url"
                  name="linkedin"
                  className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                  value={usuarioDados.linkedin}
                  onChange={handleUsuarioChange}
                  placeholder="https://linkedin.com/in/..."
                />
              </label>

              <label className="block mb-3">
                <span className="text-sm font-medium">Currículo Lattes</span>
                <input
                  type="url"
                  name="curriculoLattes"
                  className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                  value={usuarioDados.curriculoLattes}
                  onChange={handleUsuarioChange}
                  placeholder="https://lattes.cnpq.br/..."
                />
              </label>

              <label className="block mb-3">
                <span className="text-sm font-medium">Foto do usuário</span>

                <div className="mt-1 flex items-center gap-3">
                  <label
                    htmlFor="fotoUpload"
                    className="cursor-pointer inline-block bg-gray-200 hover:bg-gray-300 text-sm text-gray-700 font-medium py-2 px-4 rounded"
                  >
                    Selecionar imagem
                  </label>

                  <span className="text-sm text-gray-600 truncate max-w-[200px]">
                    {usuarioDados.fotoFile?.name ?? "Nenhum arquivo escolhido"}
                  </span>

                  <input
                    id="fotoUpload"
                    type="file"
                    accept="image/*"
                    name="foto"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUsuarioDados((prev) => ({
                          ...prev,
                          fotoFile: file,
                        }));
                      }
                    }}
                  />
                </div>
              </label>

              <label className="block mb-3">
                <span className="text-sm font-medium">Biografia</span>
                <textarea
                  name="biografia"
                  className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 resize-none"
                  rows={3}
                  value={usuarioDados.biografia}
                  onChange={handleUsuarioChange}
                />
              </label>

              <label className="block mb-5">
                <span className="text-sm font-medium">Tipo de Usuário</span>
                <select
                  name="tipoUsuario"
                  className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                  value={usuarioDados.tipoUsuario}
                  onChange={handleUsuarioChange}
                >
                  <option value="ALUNO">Aluno</option>
                  <option value="PROFESSOR">Professor</option>
                  <option value="FORMADO">Formado</option>
                  <option value="RECRUTADOR">Recrutador</option>
                </select>
              </label>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={fecharModalCadastro}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Enviar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
