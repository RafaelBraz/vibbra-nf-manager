import { ExpenseService } from "@/services/expense/expense.service";
import { GetManyExpensesUseCase } from "@/use-cases/expenses/getMany.expense.use-case";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const expenseService = new ExpenseService();

    switch (req.method) {
      case "GET":
        const { userId } = req.query;

        if (!userId) {
          throw new Error("User id is required.");
        }

        if (userId instanceof Array) {
          throw new Error("Many ids is not allowed.");
        }

        const getManyExpensesUseCase = new GetManyExpensesUseCase(
          expenseService
        );

        const expenses = await getManyExpensesUseCase.execute({
          where: {
            expenseOfId: userId,
          },
        });

        return res.status(201).json({
          expenses,
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
