import { PartnerCompanyService } from "@/services/partnerCompany/partnerCompany.service";
import { DeletePartnerCompanyUseCase } from "@/use-cases/partnerCompany/delete.partnerCompany.use-case copy";
import { GetPartnerCompanyUseCase } from "@/use-cases/partnerCompany/get.partnerCompany.use-case";
import { UpdatePartnerCompanyUseCase } from "@/use-cases/partnerCompany/update.partnerCompany.use-case";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    const { cnpj, corporateName, name } = req.body;
    const partnerCompanyService = new PartnerCompanyService();

    switch (req.method) {
      case "GET":
        if (!id) {
          throw new Error("Partner Company id is required.");
        }

        if (id instanceof Array) {
          throw new Error("Many ids is not allowed.");
        }

        const getPartnerCompanyUseCase = new GetPartnerCompanyUseCase(
          partnerCompanyService
        );

        const partnerCompany = await getPartnerCompanyUseCase.execute({
          where: {
            id,
          },
        });

        return res.status(200).json({
          partnerCompany,
        });
      case "PATCH":
        if (!id) {
          throw new Error("One id is required.");
        }

        if (id instanceof Array) {
          throw new Error("Many ids is not allowed.");
        }
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
      case "DELETE":
        if (!id) {
          throw new Error("Partner Company id is required.");
        }

        if (id instanceof Array) {
          throw new Error("Many ids is not allowed.");
        }

        const deletePartnerCompanyUseCase = new DeletePartnerCompanyUseCase(
          partnerCompanyService
        );

        const deletedPartnerCompany = await deletePartnerCompanyUseCase.execute(
          {
            where: {
              id,
            },
          }
        );

        return res.status(200).json({
          partnerCompany: deletedPartnerCompany,
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
