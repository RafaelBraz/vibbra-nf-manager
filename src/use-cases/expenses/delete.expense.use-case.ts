import { ExpenseService } from "@/services/expense/expense.service";

interface IDeleteExpenseUseCaseParams {
  where: {
    id?: string;
  };
}

export class DeleteExpenseUseCase {
  constructor(private expense: ExpenseService) {}

  async execute({ where }: IDeleteExpenseUseCaseParams) {
    const { id } = where;

    if (!id) {
      throw new Error("Id is required.");
    }

    const expense = await this.expense.delete({
      id,
    });

    return expense;
  }
}
