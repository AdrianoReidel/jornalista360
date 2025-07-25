import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { NextAuthOptions, Session, User } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session }: { session: Session; user: User }) {
      return session;
    },

    async signIn({ user }) {
      // Aguarda o PrismaAdapter criar o usuário automaticamente, se for o primeiro login
      const usuario = await prisma.user.findUnique({
        where: { email: user.email! },
        include: { profile: true },
      });

      // Se o usuário foi criado agora ou já existia, checa se o perfil está ausente
      if (usuario && !usuario.profile) {
        const novoPerfil = await prisma.userProfile.create({
          data: {
            fullName: user.name ?? null,
            fotoUrl: user.image ?? null,
            criadoViaGoogle: true,
            user: {
              connect: { id: usuario.id },
            },
          },
        });

        // Conecta o novo perfil ao usuário
        await prisma.user.update({
          where: { id: usuario.id },
          data: {
            profile: {
              connect: { id: novoPerfil.id },
            },
          },
        });
      }

      return true;
    }
  },
};

export default NextAuth(authOptions);
