import { PartnerCompanyService } from "@/services/partnerCompany/partnerCompany.service";

interface IGetManyPartnerCompanyUseCaseParams {
  where: {
    partnerOfId: string;
  };
}

export class GetManyPartnerCompanyUseCase {
  constructor(private partnerCompany: PartnerCompanyService) {}

  async execute({ where }: IGetManyPartnerCompanyUseCaseParams) {
    const { partnerOfId } = where;

    if (!partnerOfId) {
      const partnerCompanies = await this.partnerCompany.findMany({});
      return partnerCompanies;
    }

    const partnerCompanies = await this.partnerCompany.findMany({
      where: {
        partnerOfId,
      },
    });
    return partnerCompanies;
  }
}
