import { InvoiceService } from "@/services/invoice/invoice.service";
import { CreateInvoiceUseCase } from "@/use-cases/invoice/create.invoice.use-case";
import { DeleteInvoiceUseCase } from "@/use-cases/invoice/delete.invoice.use-case";
import { GetInvoiceUseCase } from "@/use-cases/invoice/get.invoice.use-case";
import { UpdateInvoiceUseCase } from "@/use-cases/invoice/update.invoice.use-case";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    const { companyId, description, number, paymentIn, providedAt, value } =
      req.body;
    const invoiceService = new InvoiceService();

    switch (req.method) {
      case "GET":
        if (!id) {
          throw new Error("One id is required.");
        }

        if (id instanceof Array) {
          throw new Error("Many ids is not allowed.");
        }

        const getInvoiceUseCase = new GetInvoiceUseCase(invoiceService);

        const invoice = await getInvoiceUseCase.execute({
          where: {
            id,
          },
        });

        return res.status(200).json({
          invoice,
        });
      case "PATCH":
        if (!id) {
          throw new Error("One id is required.");
        }

        if (id instanceof Array) {
          throw new Error("Many ids is not allowed.");
        }

        const updateInvoiceUseCase = new UpdateInvoiceUseCase(invoiceService);

        const updatedInvoice = await updateInvoiceUseCase.execute({
          where: {
            id,
          },
          data: {
            companyId,
            description,
            number,
            paymentIn,
            providedAt,
            value: Number(value),
          },
        });

        return res.status(200).json({
          invoice: updatedInvoice,
        });
      case "DELETE":
        if (!id) {
          throw new Error("Partner Company id is required.");
        }

        if (id instanceof Array) {
          throw new Error("Many ids is not allowed.");
        }

        const deleteInvoiceUseCase = new DeleteInvoiceUseCase(invoiceService);

        const deletedInvoice = await deleteInvoiceUseCase.execute({
          where: {
            id,
          },
        });

        return res.status(200).json({
          invoice: deletedInvoice,
        });
      default:
        return res.status(405).json({
          message: `Method ${req.method} not allowed.`,
        });
    }
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ name: "Application Error", message: error.message });
    }

    return res.status(500).json({ name: "Internal Server Error" });
  }
}
