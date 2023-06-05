import { CategoryService } from "@/services/category/category.service";
import { GetManyCategoryUseCase } from "@/use-cases/category/getMany.category.use-case";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId } = req.query;
    const categoryService = new CategoryService();

    switch (req.method) {
      case "GET":
        if (!userId) {
          throw new Error("User id is required.");
        }

        if (userId instanceof Array) {
          throw new Error("Many ids is not allowed.");
        }

        const getManyCategoryUseCase = new GetManyCategoryUseCase(
          categoryService
        );

        const categories = await getManyCategoryUseCase.execute({
          where: {
            userId,
          },
        });

        return res.status(201).json({
          categories,
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
