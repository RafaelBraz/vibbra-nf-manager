import { UserService } from "@/services/user/user.service";
import { CreateUserUseCase } from "@/use-cases/user/create.user.use-case";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "POST":
        const { cnpj, companyName, email, name, password, phone } = req.body;

        const userService = new UserService();
        const createUserUseCase = new CreateUserUseCase(userService);

        const user = await createUserUseCase.execute({
          cnpj,
          companyName,
          email,
          name,
          password,
          phone,
        });

        return res.status(200).json({
          message: `Done.`,
          user,
        });
      default:
        return res.status(405).json({
          message: `Method ${req.method} not allowed.`,
        });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ name: "Application Error", message: error.message });
    }

    return res.status(500).json({ name: "Internal Server Error" });
  }
}
