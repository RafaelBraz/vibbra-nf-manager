import { Prisma, PrismaClient } from "@prisma/client";

export class CategoryService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findUnique(where: Prisma.CategoryWhereUniqueInput) {
    return this.prisma.category.findUnique({
      where,
    });
  }

  async findMany(params: { where?: Prisma.CategoryWhereInput }) {
    const { where } = params;

    return this.prisma.category.findMany({
      where,
    });
  }

  async update(params: {
    where: Prisma.CategoryWhereUniqueInput;
    data: Prisma.CategoryUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.category.update({
      where,
      data,
    });
  }

  async create(data: Prisma.CategoryCreateInput) {
    return this.prisma.category.create({
      data,
    });
  }

  async delete(where: Prisma.CategoryWhereUniqueInput) {
    return this.prisma.category.delete({
      where,
    });
  }
}
