import { FormEvent } from "react";

export function CreateInvoiceForm() {
  function handleSubmit(event: FormEvent) {
    try {
      event.preventDefault();
    } catch (error) {}
  }

  return (
    <form onSubmit={handleSubmit}>
      <h4>Cadastrar Nota Fiscal</h4>
    </form>
  );
}
