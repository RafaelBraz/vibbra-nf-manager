import type { FormEvent } from "react";
import type { CategoryType } from "@/types/category,type";
import type { ExpenseType } from "@/types/expense.type";
import type { PartnerCompanyType } from "@/types/partnerCompany.type";
import { useState } from "react";
import { useSession } from "next-auth/react";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "@/lib/swr/fetcher";
import dayjs from "dayjs";
import axios from "axios";

interface ICreateExpenseFormProps {
  onClose: () => void;
}
type CategoriesSWRDataType = {
  categories: CategoryType[];
};
type PartnersSWRDataType = {
  partnerCompanies: PartnerCompanyType[];
};

export function CreateExpenseForm({ onClose }: ICreateExpenseFormProps) {
  const { data: session } = useSession();
  const { mutate } = useSWRConfig();
  const user = session?.user;
  const [step, setStep] = useState(0);
  const [newExpense, setNewExpense] = useState<Partial<ExpenseType>>({
    categoryId: undefined,
    name: "",
    value: 0,
    paymentIn: dayjs().format("YYYY-MM-DD"),
    providedAt: dayjs().format("YYYY-MM-DD"),
    companyId: undefined,
  });

  const categoriesQuery = useSWR<CategoriesSWRDataType>(
    `/api/categories/${user?.id ?? ""}`,
    fetcher
  );
  const partnersQuery = useSWR<PartnersSWRDataType>(
    `/api/partnerCompanies/${user?.id ?? ""}`,
    fetcher
  );

  function handleClose() {
    onClose();
  }

  if (categoriesQuery.isLoading || partnersQuery.isLoading) {
    return (
      <div className="w-72 p-6 flex flex-col gap-4">
        <h4>Cadastrar Despesa</h4>
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

  if (categoriesQuery.error) {
    return (
      <div className="w-72 p-6 flex flex-col gap-4">
        <h4>Cadastrar Despesa</h4>
        <hr className="w-full border-b-1" />

        <p>Erro ao buscar categorias</p>

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

  if (partnersQuery.error) {
    return (
      <div className="w-72 p-6 flex flex-col gap-4">
        <h4>Cadastrar Despesa</h4>
        <hr className="w-full border-b-1" />

        <p>Erro ao buscar empresas parceiras.</p>

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

  const categories = categoriesQuery.data?.categories ?? [];
  const partners = partnersQuery.data?.partnerCompanies ?? [];

  function handleExpenseChange(name: string, value: string | number) {
    setNewExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  if (step === 0) {
    return (
      <div className="w-72 p-6 flex flex-col gap-4">
        <h4>Cadastrar Despesa</h4>
        <hr className="w-full border-b-1" />

        <label className="flex flex-col gap-2">
          <span>Categoria:</span>

          <select
            name="category"
            id="category"
            defaultValue={"empty"}
            value={newExpense.categoryId}
            onChange={(e) => handleExpenseChange("categoryId", e.target.value)}
          >
            <option disabled value="empty">
              {" "}
              -- select an option --{" "}
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex gap-4">
          {newExpense.categoryId ? (
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

  async function handleSubmit(event: FormEvent) {
    try {
      event.preventDefault();

      const userId = user?.id;

      if (!userId) {
        throw new Error("Erro ao identificar o seu usuário.");
      }

      const { categoryId, companyId, name, paymentIn, providedAt, value } =
        newExpense;

      const res = await axios("/api/expense/", {
        method: "POST",
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        data: {
          categoryId,
          companyId,
          name,
          paymentIn: `${dayjs(paymentIn).format("YYYY-MM-DD")}T00:00:00.000Z`,
          providedAt: `${dayjs(providedAt).format("YYYY-MM-DD")}T00:00:00.000Z`,
          userId,
          value,
        },
      });

      if (res.status !== 201) {
        throw new Error("Erro durante criação da despesa.");
      }

      mutate(`/api/expenses/${userId}`);

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
      <h4>Cadastrar Despesa</h4>

      <hr className="w-full border-b-1" />

      <label className="flex flex-col gap-2">
        <span>Nome:</span>
        <input
          type="text"
          name="name"
          value={newExpense.name}
          onChange={(e) => handleExpenseChange("name", e.target.value)}
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
          value={newExpense.value}
          onChange={(e) => handleExpenseChange("value", e.target.value)}
          className="py-1 px-2 outline-none bg-zinc-50 border-2 border-zinc-300 rounded-md focus:border-zinc-900"
          required
        />
      </label>

      <label className="flex flex-col gap-2">
        <span>Empresa (prestadora do serviço):</span>

        <select
          name="company"
          id="company"
          defaultValue={"empty"}
          value={newExpense.companyId}
          onChange={(e) => handleExpenseChange("companyId", e.target.value)}
        >
          <option disabled value="empty">
            {" "}
            -- select an option --{" "}
          </option>
          {partners.map((partner) => (
            <option key={partner.id} value={partner.id}>
              {partner.corporateName}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span>Data de competência:</span>
        <input
          type="date"
          name="providedAt"
          id="providedAt"
          value={newExpense.providedAt}
          onChange={(e) =>
            handleExpenseChange(
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
          value={newExpense.paymentIn}
          onChange={(e) =>
            handleExpenseChange(
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
