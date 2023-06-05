import { ExpenseService } from "@/services/expense/expense.service";
import { DeleteExpenseUseCase } from "@/use-cases/expenses/delete.expense.use-case";
import { GetExpenseUseCase } from "@/use-cases/expenses/get.expense.use-case";
import { UpdateExpenseUseCase } from "@/use-cases/expenses/update.expense.use-case";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    const { categoryId, companyId, name, paymentIn, providedAt, value } =
      req.body;
    const expenseService = new ExpenseService();

    switch (req.method) {
      case "GET":
        if (!id) {
          throw new Error("One id is required.");
        }

        if (id instanceof Array) {
          throw new Error("Many ids is not allowed.");
        }

        const getExpenseUseCase = new GetExpenseUseCase(expenseService);

        const expense = await getExpenseUseCase.execute({
          where: {
            id,
          },
        });

        return res.status(200).json({
          expense,
        });
      case "PATCH":
        if (!id) {
          throw new Error("One id is required.");
        }

        if (id instanceof Array) {
          throw new Error("Many ids is not allowed.");
        }

        const updateExpenseUseCase = new UpdateExpenseUseCase(expenseService);

        const updatedExpense = await updateExpenseUseCase.execute({
          where: {
            id,
          },
          data: {
            categoryId,
            companyId,
            name,
            paymentIn,
            providedAt,
            value,
          },
        });

        return res.status(200).json({
          expense: updatedExpense,
        });
      case "DELETE":
        if (!id) {
          throw new Error("Expense id is required.");
        }

        if (id instanceof Array) {
          throw new Error("Many ids is not allowed.");
        }

        const deleteExpenseUseCase = new DeleteExpenseUseCase(expenseService);

        const deletedExpense = await deleteExpenseUseCase.execute({
          where: {
            id,
          },
        });

        return res.status(200).json({
          expense: deletedExpense,
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
