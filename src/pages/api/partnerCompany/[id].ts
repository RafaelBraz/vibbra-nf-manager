import { PartnerCompanyService } from "@/services/partnerCompany/partnerCompany.service";
import { GetPartnerCompanyUseCase } from "@/use-cases/partnerCompany/get.partnerCompany.use-case";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        const { id } = req.query;

        const partnerCompanyService = new PartnerCompanyService();
        const getPartnerCompanyUseCase = new GetPartnerCompanyUseCase(
          partnerCompanyService
        );

        if (!id) {
          throw new Error("One id is required.");
        }

        if (id instanceof Array) {
          throw new Error("Many ids is not allowed.");
        }

        const partnerCompany = await getPartnerCompanyUseCase.execute({
          where: {
            id,
          },
        });

        return res.status(200).json({
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
