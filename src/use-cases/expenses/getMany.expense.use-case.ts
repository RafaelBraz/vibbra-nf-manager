import { ExpenseService } from "@/services/expense/expense.service";

interface IGetManyExpensesUseCaseParams {
  where: {
    expenseOfId: string;
  };
}

export class GetManyExpensesUseCase {
  constructor(private expense: ExpenseService) {}

  async execute({ where }: IGetManyExpensesUseCaseParams) {
    const { expenseOfId } = where;

    if (!expenseOfId) {
      const expenses = await this.expense.findMany({});
      return expenses;
    }

    const expenses = await this.expense.findMany({
      where: {
        expenseOfId,
      },
    });
    return expenses;
  }
}
