import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../prisma/client";

import bcrypt from "bcrypt";

export const AuthOptions = {
    // adapter: PrismaAdapter(prisma),

    secret: process.env.NEXTAUTH_SECRET || "",
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            // サインインフォームに表示する名前 (例: "Sign in with...")
            name: "E-mail/Password",
            credentials: {
                email: {
                    label: "E-mail",
                    type: "email",
                    placeholder: "E-mail",
                },
                password: { label: "パスワード", type: "password" },
            },
            async authorize(credentials, req) {
                const email = credentials?.email;
                const password = credentials?.password || "";
                const user = await prisma.user.findUnique({ where: { email } });
                if (user == null) {
                    return null;
                }
                if (bcrypt.compareSync(password, user.crypted_password || "")) {
                    const { crypted_password, emailVerified, ...user2 } = user;
                    return user2;
                } else {
                    return null;
                }
            },
        }),
    ],

    callbacks: {
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
};

export default NextAuth(AuthOptions);
