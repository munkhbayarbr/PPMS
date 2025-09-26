// apps/web/app/api/auth/[...nextauth]/options.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const res = await fetch(`${process.env.BACKEND_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });


        if (!res.ok) return null;

        const data = await res.json();

        return {
          id: String(data.user.id),
          email: data.user.email,
          role: data.user.role,
          accessToken: data.access_token,
          name: data.user.name ?? data.user.email,
        } as any;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      // session.user-г өргөтгөх (клиентэд хэрэгтэй бол)
      session.user = {
        ...session.user,
        id: token.id as string,
        role: (token.role as string) || "user",
      } as any;
      (session as any).accessToken = token.accessToken as string | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/login", // invalid үед NextAuth энд буцаана
  },
  secret: process.env.NEXTAUTH_SECRET,
  // debug: process.env.NODE_ENV === "development",
};
