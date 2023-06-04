import { InvoiceService } from "@/services/invoice/invoice.service";

interface IGetInvoiceUseCaseParams {
  where: {
    id?: string;
    number?: number;
  };
}

export class GetInvoiceUseCase {
  constructor(private invoice: InvoiceService) {}

  async execute({ where }: IGetInvoiceUseCaseParams) {
    const { id, number } = where;

    if (!id && !number) {
      throw new Error("At least one unique key is required.");
    }

    const invoice = await this.invoice.findUnique({
      id,
      number,
    });

    if (!invoice) {
      throw new Error("Partner not found.");
    }

    return invoice;
  }
}
