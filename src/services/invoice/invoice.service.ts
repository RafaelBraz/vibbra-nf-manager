import { Prisma, PrismaClient } from "@prisma/client";
import prisma from "../../lib/prisma/";

export class InvoiceService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async findUnique(where: Prisma.InvoiceWhereUniqueInput) {
    return this.prisma.invoice.findUnique({
      where,
    });
  }

  async findMany(params: { where?: Prisma.InvoiceWhereInput }) {
    const { where } = params;

    return this.prisma.invoice.findMany({
      where,
    });
  }

  async update(params: {
    where: Prisma.InvoiceWhereUniqueInput;
    data: Prisma.InvoiceUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.invoice.update({
      where,
      data,
    });
  }

  async create(data: Prisma.InvoiceCreateInput) {
    return this.prisma.invoice.create({
      data,
    });
  }

  async delete(where: Prisma.InvoiceWhereUniqueInput) {
    return this.prisma.invoice.delete({
      where,
    });
  }
}
