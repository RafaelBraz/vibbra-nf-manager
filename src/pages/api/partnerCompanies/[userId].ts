import { PartnerCompanyService } from "@/services/partnerCompany/partnerCompany.service";
import { GetManyPartnerCompanyUseCase } from "@/use-cases/partnerCompany/getMany.partnerCompany.use-case";
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

        return res.status(200).json({
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
