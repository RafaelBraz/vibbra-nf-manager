import { CategoryService } from "@/services/category/category.service";
import { GetCategoryUseCase } from "@/use-cases/category/get.category.use-case";
import { UpdateCategoryUseCase } from "@/use-cases/category/update.category.use-case";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    const { archieved, description, name } = req.body;
    const categoryService = new CategoryService();

    switch (req.method) {
      case "GET":
        if (!id) {
          throw new Error("One id is required.");
        }

        if (id instanceof Array) {
          throw new Error("Many ids is not allowed.");
        }

        const getCategoryUseCase = new GetCategoryUseCase(categoryService);

        const category = await getCategoryUseCase.execute({
          where: {
            id,
          },
        });

        return res.status(200).json({
          category,
        });
      case "PATCH":
        if (!id) {
          throw new Error("One id is required.");
        }

        if (id instanceof Array) {
          throw new Error("Many ids is not allowed.");
        }

        const updateCategoryUseCase = new UpdateCategoryUseCase(
          categoryService
        );

        const updatedCategory = await updateCategoryUseCase.execute({
          where: {
            id,
          },
          data: {
            archieved,
            description,
            name,
          },
        });

        return res.status(200).json({
          category: updatedCategory,
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
