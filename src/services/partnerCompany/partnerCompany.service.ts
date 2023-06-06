import { PrismaClientSingleton } from "@/lib/prisma/prisma.singleton";
import { Prisma, PrismaClient } from "@prisma/client";

export class PartnerCompanyService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = PrismaClientSingleton.getClient();
  }

  async findUnique(where: Prisma.PartnerCompanyWhereUniqueInput) {
    return this.prisma.partnerCompany.findUnique({
      where,
    });
  }

  async findMany(params: { where?: Prisma.PartnerCompanyWhereInput }) {
    const { where } = params;

    return this.prisma.partnerCompany.findMany({
      where,
    });
  }

  async update(params: {
    where: Prisma.PartnerCompanyWhereUniqueInput;
    data: Prisma.PartnerCompanyUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.partnerCompany.update({
      where,
      data,
    });
  }

  async create(data: Prisma.PartnerCompanyCreateInput) {
    return this.prisma.partnerCompany.create({
      data,
    });
  }

  async delete(where: Prisma.PartnerCompanyWhereUniqueInput) {
    return this.prisma.partnerCompany.delete({
      where,
    });
  }
}
