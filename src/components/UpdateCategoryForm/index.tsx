import type { FormEvent } from "react";
import type { CategoryType } from "@/types/category,type";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useSWRConfig } from "swr";
import axios from "axios";
import { ToggleButton } from "../ToggleButton";

interface IUpdateCategoryFormProps {
  value: Partial<CategoryType>;
  onClose: () => void;
}

export function UpdateCategoryForm({
  value,
  onClose,
}: IUpdateCategoryFormProps) {
  const { data: session } = useSession();
  const { mutate } = useSWRConfig();
  const [updatedCategory, setUpdatedCategory] = useState(value);

  function handleCategoryChange(name: string, value: string | boolean) {
    setUpdatedCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent) {
    try {
      event.preventDefault();

      const userId = session?.user.id;

      if (!userId) {
        throw new Error("Erro ao identificar o seu usuário.");
      }

      const { description, name, archieved } = updatedCategory;

      if (!description || !name) {
        throw new Error("Todos os campos são obrigatórios.");
      }

      const res = await axios(`/api/category/${value.id}`, {
        method: "PATCH",
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        data: {
          description,
          name,
          archieved,
        },
      });

      if (res.status !== 200) {
        throw new Error("Erro na atualização da categoria.");
      }

      mutate(`/api/categories/${userId}`);

      onClose();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  function handleReset(event: FormEvent) {
    event.preventDefault();
    onClose();
  }

  return (
    <form
      onSubmit={handleSubmit}
      onReset={handleReset}
      className="w-72 p-6 flex flex-col gap-4"
    >
      <h4>Atualizar Categoria</h4>

      <hr className="w-full border-b-1" />

      <label className="flex flex-col gap-2">
        <span>Nome:</span>
        <input
          type="text"
          name="name"
          className="py-1 px-2 outline-none bg-zinc-50 border-2 border-zinc-300 rounded-md focus:border-zinc-900"
          value={updatedCategory.name}
          onChange={(e) => handleCategoryChange("name", e.target.value)}
          required
        />
      </label>

      <label className="flex flex-col gap-2">
        <span>Descrição:</span>
        <input
          type="text"
          name="description"
          className="py-1 px-2 outline-none bg-zinc-50 border-2 border-zinc-300 rounded-md focus:border-zinc-900"
          value={updatedCategory.description}
          onChange={(e) => handleCategoryChange("description", e.target.value)}
          required
        />
      </label>

      <div className="flex items-center gap-4">
        <span>Arquivada:</span>

        <ToggleButton
          value={updatedCategory.archieved}
          onChange={(value) => handleCategoryChange("archieved", value)}
          textOnFalse="NÃO"
          textOnTrue="SIM"
        />
      </div>

      <div className="flex gap-4">
        <button
          type={"submit"}
          className="py-2 px-4 bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400"
        >
          Atualizar
        </button>

        <button
          type={"reset"}
          className="py-2 px-4 bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
