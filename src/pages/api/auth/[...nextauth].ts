import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import { UserService } from "@/services/user/user.service";
import { GetUserUseCase } from "@/use-cases/user/get.user.use-case";
import { CreateUserUseCase } from "@/use-cases/user/create.user.use-case";

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
  ],
};
export default NextAuth(authOptions);
