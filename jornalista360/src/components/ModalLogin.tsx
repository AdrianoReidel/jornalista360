// components/ModalLogin.tsx
"use client";

import React from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function ModalLogin() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px]">
        <h2
            className="text-5xl font-bold mb-10 text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Jornalista 360
          </h2>
        <h2 className="text-base font-semibold mb-4 text-center">Entre ou cadastre-se</h2>
        <button
          onClick={() => signIn("google")}
          className="w-full mt-4 border border-gray-300 hover:bg-gray-100 text-gray-800 py-2 rounded transition flex items-center justify-center gap-2"
        >
          <Image src="/google.svg" className="w-5 h-5" alt="Google" width={20} height={20} />
          Acessar com Google
        </button>
      </div>
    </div>
  );
}