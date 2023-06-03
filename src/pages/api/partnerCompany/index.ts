import { PartnerCompanyService } from "@/services/partnerCompany/partnerCompany.service";
import { CreatePartnerCompanyUseCase } from "@/use-cases/partnerCompany/create.partnerCompany.use-case";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "POST":
        const { cnpj, corporateName, name, userId } = req.body;

        const partnerCompanyService = new PartnerCompanyService();
        const createPartnerCompanyUseCase = new CreatePartnerCompanyUseCase(
          partnerCompanyService
        );

        const partnerCompany = await createPartnerCompanyUseCase.execute({
          cnpj,
          corporateName,
          name,
          userId,
        });

        return res.status(200).json({
          message: `Done.`,
          partnerCompany,
        });
      default:
        return res.status(405).json({
          message: `Method ${req.method} not allowed.`,
        });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ name: "Application Error", message: error.message });
    }

    return res.status(500).json({ name: "Internal Server Error" });
  }
}
