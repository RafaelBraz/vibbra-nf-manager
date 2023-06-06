import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    email: string;
    name: string;
    user: DefaultSession["user"];
  }
}
