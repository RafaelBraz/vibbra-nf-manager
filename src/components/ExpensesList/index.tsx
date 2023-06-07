import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "@/lib/swr/fetcher";
import { createPortal } from "react-dom";
import { Modal } from "../Modal";
import { ExpenseType } from "@/types/expense.type";
import { CreateExpenseForm } from "../CreateExpenseForm";
import { UpdateExpenseForm } from "../UpdateExpenseForm";
import dayjs from "dayjs";
type ModalOperationType = "CREATE" | "UPDATE" | null;
type SWRDataType = {
  expenses: ExpenseType[];
};

export function ExpensesList() {
  const { data: session } = useSession();
  const user = session?.user;
  const portalRef = useRef<any>(null);
  const [openedModal, setOpenedModal] = useState<ModalOperationType>(null);
  const [updateExpense, setUpdateExpense] =
    useState<Partial<ExpenseType> | null>(null);

  const { data, error, isLoading } = useSWR<SWRDataType>(
    `/api/expenses/${user?.id ?? ""}`,
    fetcher
  );

  useEffect(() => {
    portalRef.current = document.querySelector("#modal-portal");
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Erro ao carregar despesas.</p>;
  }

  const expenses = data?.expenses ?? [];

  function handleExpenseUpdate(id: string) {
    if (!id) {
      alert("Erro ao carregar despesa.");
      return;
    }

    const expense = expenses.find((expense) => expense.id === id);

    if (!expense) {
      alert("Erro ao carregar despesa.");
      return;
    }

    setUpdateExpense(expense);
    setOpenedModal("UPDATE");
  }

  function handleModalClose() {
    setOpenedModal(null);
  }

  const modals = {
    CREATE: (
      <Modal onClose={handleModalClose}>
        <CreateExpenseForm onClose={handleModalClose} />
      </Modal>
    ),
    UPDATE: updateExpense && (
      <Modal onClose={handleModalClose}>
        <UpdateExpenseForm value={updateExpense} onClose={handleModalClose} />
      </Modal>
    ),
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="py-2 text-xl border-y-2 border-zinc-200">
        Gerenciar Despesas
      </h3>

      <button
        className="py-2 px-4 self-start bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400"
        onClick={() => setOpenedModal("CREATE")}
      >
        Cadastrar Despesa
      </button>

      <div className="flex flex-col gap-2">
        <h4 className="text-lg">Despesas cadastradas</h4>

        <div className="max-h-64 flex flex-col gap-1 overflow-auto">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="w-full flex border-2 border-zinc-300 rounded-md overflow-hidden"
            >
              <h5 className="py-2 px-4">{`${expense.name} (${dayjs(
                expense.providedAt.split("T")[0]
              ).format("DD-MM-YYYY")})`}</h5>
              <button
                className="py-2 px-4 ml-auto text-zinc-900 hover:bg-zinc-300"
                onClick={() => handleExpenseUpdate(expense.id)}
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      </div>

      {openedModal && createPortal(modals[openedModal], portalRef.current)}
    </div>
  );
}
