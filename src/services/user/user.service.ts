import { Prisma, PrismaClient } from "@prisma/client";
import prisma from "../../lib/prisma/";

export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async findUnique(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where,
    });
  }

  async findMany(params: { where?: Prisma.UserWhereInput }) {
    const { where } = params;

    return this.prisma.user.findMany({
      where,
    });
  }

  async create(data: Prisma.UserCreateInput) {
    const { cnpj, companyName, email, name, password, phone } = data;

    const createdUser = await this.prisma.user.create({
      data: {
        cnpj,
        companyName,
        email,
        name,
        password,
        phone,
      },
    });

    return createdUser;
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.user.update({
      where,
      data,
    });
  }

  async delete(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.delete({
      where,
    });
  }
}
