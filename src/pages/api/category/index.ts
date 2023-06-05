import { CategoryService } from "@/services/category/category.service";
import { CreateCategoryUseCase } from "@/use-cases/category/create.category.use-case";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { name, description, userId } = req.body;
    const categoryService = new CategoryService();

    switch (req.method) {
      case "POST":
        const createCategoryUseCase = new CreateCategoryUseCase(
          categoryService
        );

        const createdCategory = await createCategoryUseCase.execute({
          data: {
            description,
            name,
            userId,
          },
        });

        return res.status(201).json({
          category: createdCategory,
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
