import type { PartnerCompanyType } from "@/types/partnerCompany.type";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "@/lib/swr/fetcher";
import { Modal } from "../Modal";
import { CreatePartnerForm } from "../CreatePartnerForm";
import { UpdatePartnerForm } from "../UpdatePartnerForm";

type OpenedModalType = "NEW" | "UPDATE" | null;

export function PartnersList() {
  const { data: session } = useSession();
  const user = session?.user;
  const portalRef = useRef<any>(null);
  const [openedModal, setOpenedModal] = useState<OpenedModalType>(null);
  const [updatePartner, setUpdatePartner] =
    useState<Partial<PartnerCompanyType> | null>(null);

  useEffect(() => {
    portalRef.current = document.querySelector("#modal-portal");
  }, []);

  const { data, error, isLoading } = useSWR(
    `/api/partnerCompanies/${user?.id ?? ""}`,
    fetcher
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Erro ao carregar empresas parceiras.</p>;
  }

  const partners: PartnerCompanyType[] = data.partnerCompanies;

  function handlePartnerUpdate(id?: string) {
    if (!id) {
      alert("Erro ao carregar empresa parceira.");
      return;
    }

    const partner = partners.find((partner) => partner.id === id);

    if (!partner) {
      alert("Erro ao carregar empresa parceira.");
      return;
    }

    setOpenedModal("UPDATE");
    setUpdatePartner(partner);
  }

  function handleModalClose() {
    setOpenedModal(null);
  }

  const modals = {
    NEW: (
      <Modal onClose={handleModalClose}>
        <CreatePartnerForm onClose={handleModalClose} />
      </Modal>
    ),
    UPDATE: updatePartner && (
      <Modal onClose={handleModalClose}>
        <UpdatePartnerForm value={updatePartner} onClose={handleModalClose} />
      </Modal>
    ),
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="py-2 text-xl border-y-2 border-zinc-200">
        Gerenciar empresas parceiras
      </h3>

      <button
        className="py-2 px-4 self-start bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400"
        onClick={() => setOpenedModal("NEW")}
      >
        Nova empresa parceira
      </button>

      <div className="flex flex-col gap-2">
        <h4 className="text-lg">Parceiros existentes</h4>

        <div className="max-h-64 flex flex-col gap-1 overflow-auto">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="w-full flex border-2 border-zinc-300 rounded-md overflow-hidden"
            >
              <h5 className="py-2 px-4">{partner.name}</h5>
              <button
                className="py-2 px-4 ml-auto text-zinc-900 hover:bg-zinc-300"
                onClick={() => handlePartnerUpdate(partner.id)}
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
