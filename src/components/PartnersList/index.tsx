import { PartnerCompanyType } from "@/types/partnerCompany.type";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Modal } from "../Modal";
import { CreatePartnerForm } from "../CreatePartnerForm";
import { UpdatePartnerForm } from "../UpdatePartnerForm";
import { createPortal } from "react-dom";

interface IPartnersListProps {}

type OpenedModalType = "NEW-PARTNER" | "UPDATE-PARTNER" | null;

export function PartnersList({}: IPartnersListProps) {
  const { data: session } = useSession();
  const portalRef = useRef<any>(null);
  const [openedModal, setOpenedModal] = useState<OpenedModalType>(null);
  const [partners, setPartners] = useState<Partial<PartnerCompanyType>[]>([]);
  const [updatePartner, setUpdatePartner] =
    useState<Partial<PartnerCompanyType> | null>(null);

  useEffect(() => {
    portalRef.current = document.querySelector("#modal-portal");
  }, []);

  useEffect(() => {
    if (session?.user) {
      const userId = session?.user.id;

      axios(`/api/partnerCompanies/${userId}`, {
        method: "GET",
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      }).then((res) => {
        if (res.status !== 200) {
          alert("Erro ao carregar empresas parceiras.");
        }
        if (res.data.partnerCompanies.length > 0) {
          setPartners([...res.data.partnerCompanies]);
        }
      });
    }
  }, [session?.user]);

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

    setOpenedModal("UPDATE-PARTNER");
    setUpdatePartner(partner);
  }

  function handleModalClose() {
    setOpenedModal(null);
  }

  function onCreate(partner: PartnerCompanyType) {
    setPartners((prev) => [...prev, partner]);
  }

  function onUpdate(updatedPartner: PartnerCompanyType) {
    setPartners((prev) => [
      ...prev.map((partner) => {
        if (partner.id === updatedPartner.id) return updatedPartner;
        return partner;
      }),
    ]);
  }

  const modals = {
    "NEW-PARTNER": (
      <Modal onClose={handleModalClose}>
        <CreatePartnerForm onCreate={onCreate} onClose={handleModalClose} />
      </Modal>
    ),
    "UPDATE-PARTNER": updatePartner && (
      <Modal onClose={handleModalClose}>
        <UpdatePartnerForm
          value={updatePartner}
          onUpdate={onUpdate}
          onClose={handleModalClose}
        />
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
        onClick={() => setOpenedModal("NEW-PARTNER")}
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
