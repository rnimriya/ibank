import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "../../../../lib/prisma";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // ===== VERCEL DEMO BYPASS =====
          // Since SQLite is read-only on Vercel's Serverless functions,
          // we bypass the actual DB check for the MVP demo.
          if (process.env.VERCEL || process.env.NODE_ENV === "production" || !process.env.DATABASE_URL) {
            return {
              id: "demo-" + Date.now(),
              email: credentials.email,
              name: credentials.email.split("@")[0],
              role: "ADMIN",
            };
          }
          // ===============================

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
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
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  // Provide a fallback secret for Vercel demo if not set in environment variables
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_demo_only_12345",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
