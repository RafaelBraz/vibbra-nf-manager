import { ExpenseService } from "@/services/expense/expense.service";

interface IUpdateExpenseUseCaseParams {
  where: {
    id?: string;
  };
  data: {
    categoryId: string;
    companyId: string;
    name: string;
    value: number;
    providedAt: string;
    paymentIn: string;
  };
}

export class UpdateExpenseUseCase {
  constructor(private expense: ExpenseService) {}

  async execute({ where, data }: IUpdateExpenseUseCaseParams) {
    const { id } = where;
    const { categoryId, companyId, name, paymentIn, providedAt, value } = data;

    if (!id) {
      throw new Error("Id is required.");
    }

    const expense = await this.expense.update({
      where: {
        id,
      },
      data: {
        name,
        value,
        providedAt,
        paymentIn,
        category: {
          connect: {
            id: categoryId,
          },
        },
        company: {
          connect: {
            id: companyId,
          },
        },
      },
    });

    return expense;
  }
}
