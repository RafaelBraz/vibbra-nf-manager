import { FormEvent } from "react";

export function CreatePartnerForm() {
  function handleSubmit(event: FormEvent) {
    try {
      event.preventDefault();
    } catch (error) {}
  }

  return (
    <form onSubmit={handleSubmit}>
      <h4>Cadastrar Empresa Parceira</h4>
    </form>
  );
}
