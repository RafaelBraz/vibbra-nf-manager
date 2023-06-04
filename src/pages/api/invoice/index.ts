import { InvoiceService } from "@/services/invoice/invoice.service";
import { CreateInvoiceUseCase } from "@/use-cases/invoice/create.invoice.use-case";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const {
      companyId,
      description,
      number,
      paymentIn,
      providedAt,
      userId,
      value,
    } = req.body;
    const invoiceService = new InvoiceService();

    switch (req.method) {
      case "POST":
        const createInvoiceUseCase = new CreateInvoiceUseCase(invoiceService);

        const createdInvoice = await createInvoiceUseCase.execute({
          data: {
            companyId,
            description,
            number,
            paymentIn,
            providedAt,
            userId,
            value,
          },
        });

        return res.status(201).json({
          invoice: createdInvoice,
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
