import { InvoiceService } from "@/services/invoice/invoice.service";

interface ICreateInvoiceUseCaseParams {
  data: {
    userId: string;
    companyId: string;
    number: number;
    value: number;
    description: string;
    providedAt: string;
    paymentIn: string;
  };
}

export class CreateInvoiceUseCase {
  constructor(private invoice: InvoiceService) {}

  async execute({ data }: ICreateInvoiceUseCaseParams) {
    const {
      companyId,
      description,
      number,
      paymentIn,
      providedAt,
      userId,
      value,
    } = data;

    if (
      !userId ||
      !companyId ||
      !number ||
      !providedAt ||
      !paymentIn ||
      !value ||
      !description
    ) {
      throw new Error("All fields are required.");
    }

    const invoice = await this.invoice.findMany({
      where: {
        number,
      },
    });

    if (invoice.length > 0) {
      throw new Error("Invoice with this number already exists.");
    }

    const createdInvoice = await this.invoice.create({
      number,
      value,
      description,
      providedAt,
      paymentIn,
      company: {
        connect: {
          id: companyId,
        },
      },
      invoiceOf: {
        connect: {
          id: userId,
        },
      },
    });

    return createdInvoice;
  }
}
