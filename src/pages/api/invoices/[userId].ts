import { InvoiceService } from "@/services/invoice/invoice.service";
import { GetManyInvoiceUseCase } from "@/use-cases/invoice/getMany.invoice.use-case";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const invoiceService = new InvoiceService();

    switch (req.method) {
      case "GET":
        const { userId } = req.query;

        if (!userId) {
          throw new Error("User id is required.");
        }

        if (userId instanceof Array) {
          throw new Error("Many ids is not allowed.");
        }

        const getManyInvoicesUseCase = new GetManyInvoiceUseCase(
          invoiceService
        );

        const invoices = await getManyInvoicesUseCase.execute({
          where: {
            invoiceOfId: userId,
          },
        });

        return res.status(200).json({
          invoices,
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
