import { Prisma, PrismaClient } from "@prisma/client";
import prisma from "../../lib/prisma/";

export class ExpenseService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async findUnique(where: Prisma.ExpenseWhereUniqueInput) {
    return this.prisma.expense.findUnique({
      where,
    });
  }

  async findMany(params: { where?: Prisma.ExpenseWhereInput }) {
    const { where } = params;

    return this.prisma.expense.findMany({
      where,
    });
  }

  async update(params: {
    where: Prisma.ExpenseWhereUniqueInput;
    data: Prisma.ExpenseUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.expense.update({
      where,
      data,
    });
  }

  async create(data: Prisma.ExpenseCreateInput) {
    return this.prisma.expense.create({
      data,
    });
  }

  async delete(where: Prisma.ExpenseWhereUniqueInput) {
    return this.prisma.expense.delete({
      where,
    });
  }
}
