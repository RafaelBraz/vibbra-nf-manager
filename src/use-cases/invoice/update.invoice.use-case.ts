import { InvoiceService } from "@/services/invoice/invoice.service";

interface IUpdateInvoiceUseCaseParams {
  where: {
    id?: string;
  };
  data: {
    companyId: string;
    number: number;
    value: number;
    description: string;
    providedAt: string;
    paymentIn: string;
  };
}

export class UpdateInvoiceUseCase {
  constructor(private invoice: InvoiceService) {}

  async execute({ where, data }: IUpdateInvoiceUseCaseParams) {
    const { id } = where;
    const { companyId, description, number, paymentIn, providedAt, value } =
      data;

    if (!id) {
      throw new Error("Id is required.");
    }

    const invoice = await this.invoice.update({
      where: {
        id,
      },
      data: {
        number,
        value,
        description,
        providedAt,
        paymentIn,
        company: companyId
          ? {
              connect: {
                id: companyId,
              },
            }
          : undefined,
      },
    });

    return invoice;
  }
}
