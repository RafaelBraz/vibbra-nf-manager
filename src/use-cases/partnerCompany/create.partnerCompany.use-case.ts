import { PartnerCompanyService } from "@/services/partnerCompany/partnerCompany.service";

interface ICreatePartnerCompanyUseCaseParams {
  userId: string;
  cnpj: string;
  name: string;
  corporateName: string;
}

export class CreatePartnerCompanyUseCase {
  constructor(private partnerCompany: PartnerCompanyService) {}

  async execute(params: ICreatePartnerCompanyUseCaseParams) {
    const { cnpj, corporateName, name, userId } = params;

    if (!cnpj || !corporateName || !name || !userId) {
      throw new Error("All fields are required.");
    }

    const user = await this.partnerCompany.findMany({
      where: {
        cnpj,
        corporateName,
      },
    });

    if (user.length > 0) {
      throw new Error("User already exists.");
    }

    const createdUser = await this.partnerCompany.create({
      cnpj,
      corporateName,
      name,
      partnerOf: {
        connect: {
          id: userId,
        },
      },
    });

    return createdUser;
  }
}
