import { FormEvent } from "react";

export function CreateExpenseForm() {
  function handleSubmit(event: FormEvent) {
    try {
      event.preventDefault();
    } catch (error) {}
  }

  return (
    <form onSubmit={handleSubmit}>
      <h4>Cadastrar Despesa</h4>
    </form>
  );
}
