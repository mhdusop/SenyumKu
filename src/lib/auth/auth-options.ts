import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

declare module "next-auth" {
   interface Session {
      user: {
         id: string;
         username: string;
         role: string;
      };
   }
   interface User {
      id: string;
      username: string;
      role: string;
   }
}

declare module "next-auth/jwt" {
   interface JWT {
      id: string;
      username: string;
      role: string;
   }
}

export const authOptions: AuthOptions = {
   providers: [
      CredentialsProvider({
         name: "credentials",
         credentials: {
            username: { label: "Username", type: "text" },
            password: { label: "Password", type: "password" },
         },
         async authorize(credentials) {
            if (!credentials?.username || !credentials?.password) return null;

            const user = await prisma.user.findUnique({
               where: { username: credentials.username },
            });

            if (!user || !user.password) return null;

            const isValid = await bcrypt.compare(
               credentials.password,
               user.password
            );
            if (!isValid) return null;

            return {
               id: user.id + "",
               username: user.username,
               role: user.role,
            };
         },
      }),
   ],
   session: {
      strategy: "jwt",
   },
   callbacks: {
      async jwt({ token, user }) {
         if (user) {
            token.id = user.id;
            token.username = user.username;
            token.role = user.role;
         }
         return token;
      },
      async session({ session, token }) {
         if (token) {
            session.user = {
               id: token.id,
               username: token.username,
               role: token.role,
            };
         }
         return session;
      },
   },
   pages: {
      signIn: "/auth/login",
   },
   secret: process.env.NEXTAUTH_SECRET,
};
