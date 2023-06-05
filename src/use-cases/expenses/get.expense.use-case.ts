import { ExpenseService } from "@/services/expense/expense.service";

interface IGetExpenseUseCaseParams {
  where: {
    id?: string;
  };
}

export class GetExpenseUseCase {
  constructor(private expense: ExpenseService) {}

  async execute({ where }: IGetExpenseUseCaseParams) {
    const { id } = where;

    if (!id) {
      throw new Error("Id is required.");
    }

    const expense = await this.expense.findUnique({
      id,
    });

    if (!expense) {
      throw new Error("Expense not found.");
    }

    return expense;
  }
}
