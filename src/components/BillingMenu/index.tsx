import { ExpensesList } from "../ExpensesList";
import { InvoiceList } from "../InvoiceList";

export function BillingMenu() {
  return (
    <div className="p-4 w-full flex flex-col gap-2 basis-1/4 bg-zinc-50">
      <h2 className="text-2xl">Menu de pagamentos</h2>

      <InvoiceList />
      <ExpensesList />
    </div>
  );
}
