import { PartnerCompanyService } from "@/services/partnerCompany/partnerCompany.service";
import { CreatePartnerCompanyUseCase } from "@/use-cases/partnerCompany/create.partnerCompany.use-case";
import { DeletePartnerCompanyUseCase } from "@/use-cases/partnerCompany/delete.partnerCompany.use-case copy";
import { GetPartnerCompanyUseCase } from "@/use-cases/partnerCompany/get.partnerCompany.use-case";
import { GetManyPartnerCompanyUseCase } from "@/use-cases/partnerCompany/getMany.partnerCompany.use-case";
import { UpdatePartnerCompanyUseCase } from "@/use-cases/partnerCompany/update.partnerCompany.use-case";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const partnerCompanyService = new PartnerCompanyService();

    switch (req.method) {
      case "GET":
        const { userId } = req.query;

        if (!userId) {
          throw new Error("User id is required.");
        }

        if (userId instanceof Array) {
          throw new Error("Many ids is not allowed.");
        }

        const getManyPartnerCompanyUseCase = new GetManyPartnerCompanyUseCase(
          partnerCompanyService
        );

        const partnerCompanies = await getManyPartnerCompanyUseCase.execute({
          where: {
            partnerOfId: userId,
          },
        });

        return res.status(201).json({
          partnerCompanies,
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
