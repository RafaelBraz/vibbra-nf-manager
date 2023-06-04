import { InvoiceService } from "@/services/invoice/invoice.service";

interface IGetManyInvoiceUseCaseParams {
  where: {
    invoiceOfId: string;
  };
}

export class GetManyInvoiceUseCase {
  constructor(private invoice: InvoiceService) {}

  async execute({ where }: IGetManyInvoiceUseCaseParams) {
    const { invoiceOfId } = where;

    if (!invoiceOfId) {
      const invoices = await this.invoice.findMany({});
      return invoices;
    }

    const invoices = await this.invoice.findMany({
      where: {
        invoiceOfId,
      },
    });
    return invoices;
  }
}
