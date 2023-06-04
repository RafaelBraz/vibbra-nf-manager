import { PartnerCompanyService } from "@/services/partnerCompany/partnerCompany.service";

interface IUpdatePartnerCompanyUseCaseParams {
  where: {
    id?: string;
  };
  data: {
    cnpj?: string;
    corporateName?: string;
    name?: string;
  };
}

export class UpdatePartnerCompanyUseCase {
  constructor(private partnerCompany: PartnerCompanyService) {}

  async execute({ where, data }: IUpdatePartnerCompanyUseCaseParams) {
    const { id } = where;
    const { cnpj, corporateName, name } = data;

    if (!id) {
      throw new Error("Id is required.");
    }

    const partnerCompany = await this.partnerCompany.update({
      where: {
        id,
      },
      data: {
        cnpj,
        name,
        corporateName,
      },
    });

    return partnerCompany;
  }
}
