import { FormEvent } from "react";

export function CreateCategoryForm() {
  function handleSubmit(event: FormEvent) {
    try {
      event.preventDefault();
    } catch (error) {}
  }

  return (
    <form onSubmit={handleSubmit}>
      <h4>Cadastrar Categoria</h4>
    </form>
  );
}
