import { ExpenseService } from "@/services/expense/expense.service";

interface ICreateExpenseUseCaseParams {
  data: {
    userId: string;
    companyId: string;
    categoryId: string;
    name: string;
    value: number;
    providedAt: string;
    paymentIn: string;
  };
}

export class CreateExpenseUseCase {
  constructor(private expense: ExpenseService) {}

  async execute({ data }: ICreateExpenseUseCaseParams) {
    const {
      userId,
      companyId,
      categoryId,
      name,
      value,
      providedAt,
      paymentIn,
    } = data;

    if (
      !userId ||
      !companyId ||
      !categoryId ||
      !name ||
      !value ||
      !providedAt ||
      !paymentIn
    ) {
      throw new Error("All fields are required.");
    }

    const createdExpense = await this.expense.create({
      category: {
        connect: {
          id: categoryId,
        },
      },
      name,
      paymentIn,
      providedAt,
      value,
      expenseOf: {
        connect: {
          id: userId,
        },
      },
      company: {
        connect: {
          id: companyId,
        },
      },
    });

    return createdExpense;
  }
}
