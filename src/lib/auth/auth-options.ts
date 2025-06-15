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
         pasienId?: string | null;
         dokterId: string | null;
      };
   }
   interface User {
      id: string;
      username: string;
      role: string;
      pasienId?: string | null;
      dokterId: string | null;
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
               include: {
                  pasien: true,
                  dokter: true,
               },
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
               pasienId: user.pasien?.id?.toString() ?? null,
               dokterId: user.dokter?.id.toString() ?? null,
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
            token.pasienId = user.pasienId ?? null;
            token.dokterId = user.dokterId ?? null;
         }
         return token;
      },
      async session({ session, token }) {
         if (token) {
            session.user = {
               id: token.id,
               username: token.username,
               role: token.role,
               pasienId:
                  typeof token.pasienId === "string" ? token.pasienId : null,
               dokterId:
                  typeof token.dokterId === "string" ? token.dokterId : null,
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
