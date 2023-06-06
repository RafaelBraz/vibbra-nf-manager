import { UserService } from "@/services/user/user.service";
import { GetUserUseCase } from "@/use-cases/user/get.user.use-case";
import { UpdateUserUseCase } from "@/use-cases/user/update.user.use-case";
import { removeObjectAttribute } from "@/util/object";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    const {
      cnpj,
      companyName,
      email,
      emailAlert,
      MEILimit,
      name,
      password,
      phone,
      smsAlert,
    } = req.body;
    const userService = new UserService();

    switch (req.method) {
      case "GET":
        const getUserUseCase = new GetUserUseCase(userService);

        if (!id) {
          throw new Error("One id is required.");
        }

        if (id instanceof Array) {
          throw new Error("Many ids is not allowed.");
        }

        const user = await getUserUseCase.execute({
          where: {
            id,
          },
        });

        return res.status(200).json({
          user: removeObjectAttribute(user, "password"),
        });
      case "PATCH":
        const updateUserUseCase = new UpdateUserUseCase(userService);

        if (!id) {
          throw new Error("One id is required.");
        }

        if (id instanceof Array) {
          throw new Error("Many ids is not allowed.");
        }

        const updatedUser = await updateUserUseCase.execute({
          where: {
            id,
          },
          data: {
            cnpj,
            companyName,
            email,
            emailAlert,
            MEILimit,
            name,
            password,
            phone,
            smsAlert,
          },
        });

        return res.status(200).json({
          user: removeObjectAttribute(updatedUser, "password"),
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
