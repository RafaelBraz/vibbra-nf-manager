import type { PartnerCompanyType } from "@/types/partnerCompany.type";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";

interface IUpdatePartnerFormProps {
  value: Partial<PartnerCompanyType>;
  onClose: () => void;
  onUpdate: (partnerCompany: PartnerCompanyType) => void;
}

export function UpdatePartnerForm({
  value,
  onClose,
  onUpdate,
}: IUpdatePartnerFormProps) {
  const { data: session } = useSession();
  const [updatedPartnerCompany, setUpdatedPartner] = useState(value);

  function handlePartnerChange(name: string, value: string) {
    setUpdatedPartner((prev) => ({
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

      const { cnpj, corporateName, name } = updatedPartnerCompany;

      if (!cnpj || !corporateName || !name) {
        throw new Error("Todos os campos são obrigatórios.");
      }

      const res = await axios(`/api/partnerCompany/${value.id}`, {
        method: "PATCH",
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        data: {
          cnpj,
          corporateName,
          name,
        },
      });

      if (res.status !== 200) {
        throw new Error("Erro na atualização da empresa parceira.");
      }

      onUpdate(res.data.partnerCompany);

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
      <h4>Atualizar Empresa Parceira</h4>

      <hr className="w-full border-b-1" />

      <label className="flex flex-col gap-2">
        <span>CNPJ:</span>
        <input
          type="text"
          name="cnpj"
          className="py-1 px-2 outline-none bg-zinc-50 border-2 border-zinc-300 rounded-md focus:border-zinc-900"
          value={updatedPartnerCompany.cnpj}
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
          value={updatedPartnerCompany.name}
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
          value={updatedPartnerCompany.corporateName}
          onChange={(e) => handlePartnerChange("corporateName", e.target.value)}
          required
        />
      </label>

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
