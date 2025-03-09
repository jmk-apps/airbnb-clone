import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./app/libs/prisma"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub, 
    Google,
    Credentials({
        name: "credentials",
        credentials: {
            email: { label: "email", type: "text" },
            password: { label: "password", type: "password" },
        },
        async authorize(credentials) {

            if (!credentials?.email || !credentials?.password) {
                throw new Error("Invalid credentials")
            }

            const user = await prisma.user.findUnique({
                where: {
                    email: credentials.email
                }
            })

            if (!user || !user?.hashedPassword) {
                throw new Error("Invalid credentials")
            }

            const isCorrectPassword = await bcrypt.compare(
                credentials.password,
                user.hashedPassword
            )

            if (!isCorrectPassword) {
                throw new Error("Invalid credentials")
            }

            return user
        }
    })
  ],
  pages: {
    signIn: '/',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    authorized: async ({ auth }) => {
        return !!auth
    },
  }
})

