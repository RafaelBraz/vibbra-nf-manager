import { PartnerCompanyService } from "@/services/partnerCompany/partnerCompany.service";

interface IDeletePartnerCompanyUseCaseParams {
  where: {
    id?: string;
    cnpj?: string;
    corporateName?: string;
  };
}

export class DeletePartnerCompanyUseCase {
  constructor(private partnerCompany: PartnerCompanyService) {}

  async execute({ where }: IDeletePartnerCompanyUseCaseParams) {
    const { cnpj, corporateName, id } = where;

    if (!cnpj && !corporateName && !id) {
      throw new Error("At least one unique key is required.");
    }

    const partnerCompany = await this.partnerCompany.delete({
      id,
      cnpj,
      corporateName,
    });

    return partnerCompany;
  }
}
