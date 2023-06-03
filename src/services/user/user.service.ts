import { Prisma, PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
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

    const saltRounds = Number(process.env.SALT_ROUNDS);
    const hashPassord = await hash(password, saltRounds);

    const createdUser = await this.prisma.user.create({
      data: {
        cnpj,
        companyName,
        email,
        name,
        password: hashPassord,
        phone,
      },
    });

    return createdUser;
  }
}
