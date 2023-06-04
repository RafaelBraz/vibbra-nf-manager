import { InvoiceService } from "@/services/invoice/invoice.service";

interface IDeleteInvoiceUseCaseParams {
  where: {
    id?: string;
    number?: number;
  };
}

export class DeleteInvoiceUseCase {
  constructor(private invoice: InvoiceService) {}

  async execute({ where }: IDeleteInvoiceUseCaseParams) {
    const { id, number } = where;

    if (!id && !number) {
      throw new Error("At least one unique key is required.");
    }

    const invoice = await this.invoice.delete({
      id,
      number,
    });

    return invoice;
  }
}
