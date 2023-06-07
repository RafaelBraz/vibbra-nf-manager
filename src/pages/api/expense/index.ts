import { ExpenseService } from "@/services/expense/expense.service";
import { CreateExpenseUseCase } from "@/use-cases/expenses/create.expense.use-case";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const {
      categoryId,
      companyId,
      name,
      paymentIn,
      providedAt,
      userId,
      value,
    } = req.body;
    const expenseService = new ExpenseService();

    switch (req.method) {
      case "POST":
        const createExpenseUseCase = new CreateExpenseUseCase(expenseService);

        const createdExpense = await createExpenseUseCase.execute({
          data: {
            categoryId,
            companyId,
            name,
            paymentIn,
            providedAt,
            userId,
            value: Number(value),
          },
        });

        return res.status(201).json({
          expense: createdExpense,
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
