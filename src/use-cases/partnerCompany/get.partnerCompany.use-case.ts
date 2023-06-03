import { PartnerCompanyService } from "@/services/partnerCompany/partnerCompany.service";

interface IGetPartnerCompanyUseCaseParams {
  where: {
    id?: string;
    cnpj?: string;
    corporateName?: string;
  };
}

export class GetPartnerCompanyUseCase {
  constructor(private partnerCompany: PartnerCompanyService) {}

  async execute({ where }: IGetPartnerCompanyUseCaseParams) {
    const { cnpj, corporateName, id } = where;

    if (!cnpj && !corporateName && !id) {
      throw new Error("At least one unique key is required.");
    }

    const partnerCompany = await this.partnerCompany.findUnique({
      id,
      cnpj,
      corporateName,
    });

    if (!partnerCompany) {
      throw new Error("Partner not found.");
    }

    return partnerCompany;
  }
}
