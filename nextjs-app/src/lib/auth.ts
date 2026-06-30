import { v4 as uuidv4 } from "uuid";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

interface SessionUser { id?: string; }

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        try {
          const conn = await connectDB();
          if (conn) {
            const isPhone = /^[\d\s+\-()]{7,20}$/.test(email);
            const query = isPhone ? { mobile: email } : { email: email.toLowerCase() };
            const user = await User.findOne(query).select("+password");
            if (user) {
              const isValid = await bcrypt.compare(password, user.password);
              if (isValid) {
                let uid = user.userId;
                if (!uid) {
                  uid = uuidv4();
                  await User.updateOne({ _id: user._id }, { $set: { userId: uid } });
                }
                return {
                  id: uid,
                  name: user.name,
                  email: user.email,
                  image: user.image || undefined,
                };
              }
            }
          }
        } catch {
          // MongoDB unavailable — fall through to demo login
        }

        if (process.env.ENABLE_DEMO_LOGIN === "true" && email === "demo@luminastay.com" && password === "demo123") {
          return {
            id: "demo-user-id",
            name: "Demo User",
            email: "demo@luminastay.com",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "google") {
        token.id = account.providerAccountId;
      } else if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as SessionUser).id = token.sub as string;
      return session;
    },
  },
});
