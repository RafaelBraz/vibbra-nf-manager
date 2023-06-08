import type { InvoiceType } from "@/types/invoice.type";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import useSWR from "swr";
import { fetcher } from "@/lib/swr/fetcher";
import { BillingIndicator } from "../BillingIndicator";
import { Charts } from "../Charts";

type SWRDataType = {
  invoices: InvoiceType[];
};

export function Dashboard() {
  const { data: session } = useSession();
  const user = session?.user;

  const { data, error, isLoading } = useSWR<SWRDataType>(
    `/api/invoices/${user?.id ?? ""}`,
    fetcher
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Erro ao carregar notas fiscais.</p>;
  }

  const invoices = data?.invoices ?? [];

  const alreadyBilled = invoices.reduce((sum, value) => {
    const paymentYear = dayjs(value.paymentIn).year();
    const actualYear = dayjs().year();

    if (actualYear === paymentYear) {
      return sum + value.value;
    }

    return sum;
  }, 0);

  return (
    <div className="p-4 w-full flex flex-col gap-4 flex-wrap basis-1/2 bg-zinc-50">
      <div className="flex justify-end">
        <BillingIndicator billed={alreadyBilled} limit={user?.MEILimit} />
      </div>

      <Charts />
    </div>
  );
}
