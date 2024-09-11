import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    lastName: string;
    role: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name: string;
      lastName: string;
      role: string;
      createdBy: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }

  interface JWT {
    id: string;
    lastName: string;
    role: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    name: string;
  }
}
