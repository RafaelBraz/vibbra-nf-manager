import type { FormEvent } from "react";
import type { InvoiceType } from "@/types/invoice.type";
import type { PartnerCompanyType } from "@/types/partnerCompany.type";
import { useState } from "react";
import { useSession } from "next-auth/react";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "@/lib/swr/fetcher";
import dayjs from "dayjs";
import axios from "axios";

interface ICreateInvoiceFormProps {
  onClose: () => void;
}
type SWRDataType = {
  partnerCompanies: PartnerCompanyType[];
};

export function CreateInvoiceForm({ onClose }: ICreateInvoiceFormProps) {
  const { data: session } = useSession();
  const { mutate } = useSWRConfig();
  const user = session?.user;
  const [step, setStep] = useState(0);
  const [newInvoice, setNewInvoice] = useState<Partial<InvoiceType>>({
    companyId: undefined,
    number: 0,
    value: 0,
    description: "",
    paymentIn: dayjs().format("YYYY-MM-DD"),
    providedAt: dayjs().format("YYYY-MM-DD"),
  });

  const {
    data: partnersData,
    error,
    isLoading,
  } = useSWR<SWRDataType>(`/api/partnerCompanies/${user?.id ?? ""}`, fetcher);

  function handleClose() {
    onClose();
  }

  if (isLoading) {
    return (
      <div className="w-72 p-6 flex flex-col gap-4">
        <h4>Cadastrar Nota Fiscal</h4>
        <hr className="w-full border-b-1" />

        <p>Loading...</p>

        <div className="flex gap-4">
          <button
            type={"reset"}
            className="py-2 px-4 bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400"
            onClick={handleClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-72 p-6 flex flex-col gap-4">
        <h4>Cadastrar Nota Fiscal</h4>
        <hr className="w-full border-b-1" />

        <p>Erro ao buscar parceiros</p>

        <div className="flex gap-4">
          <button
            type={"reset"}
            className="py-2 px-4 bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400"
            onClick={handleClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  const partners = partnersData?.partnerCompanies ?? [];

  function handlePartnerChange(id: string) {
    setNewInvoice((prev) => ({
      ...prev,
      companyId: id,
    }));
  }

  if (step === 0) {
    return (
      <div className="w-72 p-6 flex flex-col gap-4">
        <h4>Cadastrar Nota Fiscal</h4>
        <hr className="w-full border-b-1" />

        <label className="flex flex-col gap-2">
          <span>Empresa parceira:</span>

          <select
            name="partners"
            id="partners"
            defaultValue={"empty"}
            value={newInvoice.companyId}
            onChange={(e) => handlePartnerChange(e.target.value)}
          >
            <option disabled value="empty">
              {" "}
              -- select an option --{" "}
            </option>
            {partners.map((partner) => (
              <option key={partner.id} value={partner.id}>
                {partner.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex gap-4">
          {newInvoice.companyId ? (
            <button
              type={"button"}
              className="py-2 px-4 bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400"
              onClick={() => setStep((prev) => prev + 1)}
            >
              Próximo
            </button>
          ) : (
            <button
              type={"button"}
              className="py-2 px-4 bg-zinc-300 text-zinc-50 rounded-md cursor-[inherit]"
            >
              Próximo
            </button>
          )}

          <button
            type={"button"}
            className="py-2 px-4 bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400"
            onClick={handleClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  function handleInvoiceChange(name: string, value: string | number) {
    setNewInvoice((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent) {
    try {
      event.preventDefault();

      const userId = user?.id;

      if (!userId) {
        throw new Error("Erro ao identificar o seu usuário.");
      }

      const { companyId, description, number, paymentIn, providedAt, value } =
        newInvoice;

      const res = await axios("/api/invoice/", {
        method: "POST",
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        data: {
          companyId,
          description,
          number,
          paymentIn: `${dayjs(paymentIn).format("YYYY-MM-DD")}T00:00:00.000Z`,
          userId,
          providedAt: `${dayjs(providedAt).format("YYYY-MM-DD")}T00:00:00.000Z`,
          value,
        },
      });

      if (res.status !== 201) {
        throw new Error("Erro durante criação de nota fiscal.");
      }

      mutate(`/api/invoices/${userId}`);

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
      <h4>Cadastrar Nota Fiscal</h4>

      <hr className="w-full border-b-1" />

      <label className="flex flex-col gap-2">
        <span>Número:</span>
        <input
          type="number"
          name="number"
          value={newInvoice.number}
          onChange={(e) => handleInvoiceChange("number", e.target.value)}
          className="py-1 px-2 outline-none bg-zinc-50 border-2 border-zinc-300 rounded-md focus:border-zinc-900"
          required
        />
      </label>

      <label className="flex flex-col gap-2">
        <span>Valor:</span>
        <input
          type="number"
          name="value"
          id="value"
          min="1"
          step="any"
          value={newInvoice.value}
          onChange={(e) => handleInvoiceChange("value", e.target.value)}
          className="py-1 px-2 outline-none bg-zinc-50 border-2 border-zinc-300 rounded-md focus:border-zinc-900"
          required
        />
      </label>

      <label className="flex flex-col gap-2">
        <span>Descrição:</span>
        <input
          type="text"
          name="description"
          className="py-1 px-2 outline-none bg-zinc-50 border-2 border-zinc-300 rounded-md focus:border-zinc-900"
          value={newInvoice.description}
          onChange={(e) => handleInvoiceChange("description", e.target.value)}
          required
        />
      </label>

      <label className="flex flex-col gap-2">
        <span>Data de competência:</span>
        <input
          type="date"
          name="providedAt"
          id="providedAt"
          value={newInvoice.providedAt}
          onChange={(e) =>
            handleInvoiceChange(
              "providedAt",
              dayjs(e.target.value).format("YYYY-MM-DD")
            )
          }
        />
      </label>

      <label className="flex flex-col gap-2">
        <span>Data de pagamento:</span>
        <input
          type="date"
          name="paymentIn"
          id="paymentIn"
          value={newInvoice.paymentIn}
          onChange={(e) =>
            handleInvoiceChange(
              "paymentIn",
              dayjs(e.target.value).format("YYYY-MM-DD")
            )
          }
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
          type={"button"}
          className="py-2 px-4 bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400"
          onClick={() => setStep((prev) => prev - 1)}
        >
          Voltar
        </button>
      </div>
    </form>
  );
}
