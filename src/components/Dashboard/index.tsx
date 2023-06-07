import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "@/lib/swr/fetcher";
import { InvoiceType } from "@/types/invoice.type";

interface IDashboardProps {}

export function Dashboard({}: IDashboardProps) {
  const { data: session } = useSession();
  const user = session?.user;

  const { data, error, isLoading } = useSWR(
    `/api/invoices/${user?.id ?? ""}`,
    fetcher
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.log(error);
    return <p>Erro ao carregar notas fiscais.</p>;
  }

  const invoices: InvoiceType[] = data.invoices;

  const formattedMEILimit = user?.MEILimit.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
  const alreadyBilled = invoices.reduce((sum, value) => {
    const paymentYear = new Date(Number(value.paymentIn)).getFullYear();
    const actualYear = new Date().getFullYear();

    if (actualYear === paymentYear) {
      return sum + value.value;
    }

    return sum;
  }, 0);
  const percentAlreadyBilled = alreadyBilled / (user?.MEILimit ?? 1);
  const formattedAlreadyBilled = alreadyBilled.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="p-4 w-full bg-zinc-50">
      <div className="flex justify-between">
        <h2>{`${user?.cnpj} | ${user?.companyName}`}</h2>

        <span className="flex items-center gap-2">
          <span>{`${formattedAlreadyBilled} de ${formattedMEILimit}`}</span>
          <span>{`(${percentAlreadyBilled * 100}%)`}</span>
          <div
            className={`w-4 h-4 rounded-full ${
              percentAlreadyBilled < 0.8 ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </span>
      </div>
    </div>
  );
}
