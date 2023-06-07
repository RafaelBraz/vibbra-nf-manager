import type { FormEvent } from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useSWRConfig } from "swr";
import axios from "axios";

interface ICreatePartnerFormProps {
  onClose: () => void;
}

export function CreatePartnerForm({ onClose }: ICreatePartnerFormProps) {
  const { data: session } = useSession();
  const { mutate } = useSWRConfig();
  const [newPartnerCompany, setNewPartnerCompany] = useState({
    cnpj: "",
    corporateName: "",
    name: "",
  });

  function handlePartnerChange(name: string, value: string) {
    setNewPartnerCompany((prev) => ({
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

      const { cnpj, corporateName, name } = newPartnerCompany;

      if (!cnpj || !corporateName || !name) {
        throw new Error("Todos os campos são obrigatórios.");
      }

      const res = await axios("/api/partnerCompany/", {
        method: "POST",
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        data: {
          userId,
          cnpj,
          corporateName,
          name,
        },
      });

      if (res.status === 500) {
        throw new Error("Erro no cadastro da empresa parceira.");
      }

      mutate(`/api/partnerCompanies/${userId}`);

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
      <h4>Cadastrar Empresa Parceira</h4>

      <hr className="w-full border-b-1" />

      <label className="flex flex-col gap-2">
        <span>CNPJ:</span>
        <input
          type="text"
          name="cnpj"
          className="py-1 px-2 outline-none bg-zinc-50 border-2 border-zinc-300 rounded-md focus:border-zinc-900"
          value={newPartnerCompany.cnpj}
          onChange={(e) => handlePartnerChange("cnpj", e.target.value)}
          required
        />
      </label>

      <label className="flex flex-col gap-2">
        <span>Nome:</span>
        <input
          type="text"
          name="name"
          className="py-1 px-2 outline-none bg-zinc-50 border-2 border-zinc-300 rounded-md focus:border-zinc-900"
          value={newPartnerCompany.name}
          onChange={(e) => handlePartnerChange("name", e.target.value)}
          required
        />
      </label>

      <label className="flex flex-col gap-2">
        <span>Razão social:</span>
        <input
          type="text"
          name="corporateName"
          className="py-1 px-2 outline-none bg-zinc-50 border-2 border-zinc-300 rounded-md focus:border-zinc-900"
          value={newPartnerCompany.corporateName}
          onChange={(e) => handlePartnerChange("corporateName", e.target.value)}
          required
        />
      </label>

      <div className="flex gap-4">
        <button
          type={"submit"}
          className="py-2 px-4 bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400"
        >
          Cadastrar
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
