import { InvoiceType } from "@/types/invoice.type";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "@/lib/swr/fetcher";
import { createPortal } from "react-dom";
import { Modal } from "../Modal";
import { CreateInvoiceForm } from "../CreateInvoiceForm";
import { UpdateInvoiceForm } from "../UpdateInvoiceForm";

type ModalOperationType = "CREATE" | "UPDATE" | null;

export function InvoiceList() {
  const { data: session } = useSession();
  const user = session?.user;
  const portalRef = useRef<any>(null);
  const [openedModal, setOpenedModal] = useState<ModalOperationType>(null);
  const [updateInvoice, setUpdateInvoice] =
    useState<Partial<InvoiceType> | null>(null);

  const { data, error, isLoading } = useSWR(
    `/api/invoices/${user?.id ?? ""}`,
    fetcher
  );

  useEffect(() => {
    portalRef.current = document.querySelector("#modal-portal");
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Erro ao carregar notas fiscais.</p>;
  }

  const invoices: InvoiceType[] = data.invoices;

  function handleInvoiceUpdate(id: string) {
    if (!id) {
      alert("Erro ao carregar nota fiscal.");
      return;
    }

    const invoice = invoices.find((invoice) => invoice.id === id);

    if (!invoice) {
      alert("Erro ao carregar nota fiscal.");
      return;
    }

    setUpdateInvoice(invoice);
    setOpenedModal("UPDATE");
  }

  function handleModalClose() {
    setOpenedModal(null);
  }

  const modals = {
    CREATE: (
      <Modal onClose={handleModalClose}>
        <CreateInvoiceForm onClose={handleModalClose} />
      </Modal>
    ),
    UPDATE: updateInvoice && (
      <Modal onClose={handleModalClose}>
        <UpdateInvoiceForm value={updateInvoice} onClose={handleModalClose} />
      </Modal>
    ),
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="py-2 text-xl border-y-2 border-zinc-200">
        Gerenciar Notas Fiscais
      </h3>

      <button
        className="py-2 px-4 self-start bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400"
        onClick={() => setOpenedModal("CREATE")}
      >
        Cadastrar Nota Fiscal
      </button>

      <div className="flex flex-col gap-2">
        <h4 className="text-lg">Notas cadastradas</h4>

        <div className="max-h-64 flex flex-col gap-1 overflow-auto">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="w-full flex border-2 border-zinc-300 rounded-md overflow-hidden"
            >
              <h5 className="py-2 px-4">{invoice.number}</h5>
              <button
                className="py-2 px-4 ml-auto text-zinc-900 hover:bg-zinc-300"
                onClick={() => handleInvoiceUpdate(invoice.id)}
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
