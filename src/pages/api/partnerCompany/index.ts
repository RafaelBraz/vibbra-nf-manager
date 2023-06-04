import { PartnerCompanyService } from "@/services/partnerCompany/partnerCompany.service";
import { CreatePartnerCompanyUseCase } from "@/use-cases/partnerCompany/create.partnerCompany.use-case";
import { UpdatePartnerCompanyUseCase } from "@/use-cases/partnerCompany/update.partnerCompany.use-case";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { cnpj, corporateName, name, userId, id } = req.body;

    const partnerCompanyService = new PartnerCompanyService();

    switch (req.method) {
      case "POST":
        const createPartnerCompanyUseCase = new CreatePartnerCompanyUseCase(
          partnerCompanyService
        );

        const createdPartnerCompany = await createPartnerCompanyUseCase.execute(
          {
            cnpj,
            corporateName,
            name,
            userId,
          }
        );

        return res.status(201).json({
          partnerCompany: createdPartnerCompany,
        });
      case "PATCH":
        const updatePartnerCompanyUseCase = new UpdatePartnerCompanyUseCase(
          partnerCompanyService
        );

        const updatedPartnerCompany = await updatePartnerCompanyUseCase.execute(
          {
            where: {
              id,
            },
            data: {
              cnpj,
              corporateName,
              name,
            },
          }
        );

        return res.status(200).json({
          partnerCompany: updatedPartnerCompany,
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
