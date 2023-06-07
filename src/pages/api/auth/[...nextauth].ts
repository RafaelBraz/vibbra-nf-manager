import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { UserService } from "@/services/user/user.service";
import { GetUserUseCase } from "@/use-cases/user/get.user.use-case";
import { removeObjectAttribute } from "@/util/object";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: {
          label: "E-mail:",
          type: "email",
          placeholder: "user@email.com",
        },
        password: { label: "Password:", type: "password" },
      },
      async authorize(credentials, req) {
        const userService = new UserService();
        const getUserUseCase = new GetUserUseCase(userService);

        if (!credentials?.email) return null;

        const user = await getUserUseCase.execute({
          where: {
            email: credentials?.email,
          },
        });

        return user;
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      const email = session.user.email;
      const name = session.user.name;

      const userService = new UserService();
      const getUserUseCase = new GetUserUseCase(userService);

      const dbUser = await getUserUseCase.execute({
        where: {
          email,
        },
      });

      return {
        ...session,
        email,
        name,
        user: removeObjectAttribute(dbUser, "password"),
      };
    },
  },
};
export default NextAuth(authOptions);
