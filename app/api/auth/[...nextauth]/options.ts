import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { dbConnect } from "@/utils/dbConnect";
import bcrypt from "bcrypt";
import { User } from "@/lib/schemas/userSchema";
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string;
    lastName?: string;
    role?: string;
    createdBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string;
      lastName?: string;
      role?: string;
      createdBy?: string;
      createdAt?: string;
      updatedAt?: string;
    };
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "someone@email.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.username || !credentials.password) {
          throw new Error("Email and Password are required");
        }
        try {
          await dbConnect();
          const user = await User.findOne({
            email: credentials?.username,
          });

          if (!user) {
            return null;
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            return null;
          }

          console.log(user);

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            lastName: user.lastName,
            role: user.role,
            createdBy: user.createdBy,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };
        } catch (error) {
          console.error("Error during authorization:", error);
          return null; // Return null in case of an error
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // When the user first signs in, add their details to the token
      if (user) {
        token.email = user.email ?? undefined;
        token.name = user.name ?? undefined;
        token.lastName = user.lastName ?? undefined;
        token.role = user.role ?? undefined;
        token.createdBy = user.createdBy ?? undefined;
        token.createdAt = user.createdAt ?? undefined;
        token.updatedAt = user.updatedAt ?? undefined;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      // Pass additional user data to the session
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.lastName = token.lastName;
      session.user.role = token.role;
      session.user.createdBy = token.createdBy;
      session.user.createdAt = token.createdAt;
      session.user.updatedAt = token.updatedAt;

      return session;
    },
  },
  pages: {
    signIn: "/signIn"
  }
};

export default authOptions;
