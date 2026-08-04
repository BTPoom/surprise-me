import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// ไฟล์นี้ต้อง "edge-safe" เสมอ - ห้าม import bcrypt, Prisma, หรือ Node.js API ใดๆ
// เพราะถูกใช้ใน middleware.ts ที่รันบน Edge Runtime
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
    newUser: "/dashboard",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // หมายเหตุ: Credentials provider (ที่ใช้ bcrypt) อยู่ใน lib/auth.ts เท่านั้น
    // เพราะ Edge Runtime รัน bcrypt ไม่ได้
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id as string;
      return session;
    },
  },
};

export default authConfig;
