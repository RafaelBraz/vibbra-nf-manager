import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    email: string;
    name: string;
    user: {
      id: string;
      cnpj: string;
      companyName: string;
      phone: string;
      MEILimit: number;
      emailAlert: boolean;
      smsAlert: boolean;
    } & DefaultSession["user"];
  }
}
