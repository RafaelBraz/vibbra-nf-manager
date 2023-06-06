import { createPortal } from "react-dom";
import { CreatePartnerForm } from "../CreatePartnerForm";
import { SettingsForm } from "../SettingsForm";
import { useEffect, useRef, useState } from "react";
import { Modal } from "../Modal";
import { CreateCategoryForm } from "../CreateCategoryForm";
import axios from "axios";
import { useSession } from "next-auth/react";

interface IPreferencesMenuProps {}

type OpenedModalType =
  | "NEW-PARTNER"
  | "NEW-CATEGORY"
  | "UPDATE-PARTNER"
  | "UPDATE-CATEGORY"
  | null;

export function PreferencesMenu({}: IPreferencesMenuProps) {
  const { data: session } = useSession();
  const portalRef = useRef<any>(null);
  const [openedModal, setOpenedModal] = useState<OpenedModalType>(null);
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    if (session?.user) {
      const userId = session?.user.id;
      const res = axios(`/api/partnerCompanies/${userId}`, {
        method: "GET",
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      }).then((res) => {
        if (res.status !== 200) {
          alert("Erro ao carregar empresas parceiras.");
        }
        console.log(res.data);
      });
    }
  }, [session?.user]);

  function handleModalClose() {
    setOpenedModal(null);
  }

  const modals = {
    "NEW-PARTNER": (
      <Modal onClose={handleModalClose}>
        <CreatePartnerForm onClose={handleModalClose} />
      </Modal>
    ),
    "NEW-CATEGORY": (
      <Modal onClose={handleModalClose}>
        <CreateCategoryForm onClose={handleModalClose} />
      </Modal>
    ),
    "UPDATE-PARTNER": (
      <Modal onClose={handleModalClose}>
        <CreatePartnerForm onClose={handleModalClose} />
      </Modal>
    ),
    "UPDATE-CATEGORY": (
      <Modal onClose={handleModalClose}>
        <CreatePartnerForm onClose={handleModalClose} />
      </Modal>
    ),
  };

  useEffect(() => {
    portalRef.current = document.querySelector("#modal-portal");
  }, []);

  return (
    <div className="p-4 w-full flex flex-col gap-2 bg-zinc-50">
      <h2 className="text-2xl">Menu de preferências</h2>

      <hr className="border-b-full" />

      <SettingsForm />

      <hr className="border-b-full" />

      <div className="flex flex-col gap-4">
        <h3 className="text-xl">Gerenciar empresas parceiras</h3>

        <button
          className="py-2 px-4 self-start bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400"
          onClick={() => setOpenedModal("NEW-PARTNER")}
        >
          Nova empresa parceira
        </button>

        <div className="flex flex-col gap-2">
          <h4 className="text-lg">Parceiros existentes</h4>
          <div className="flex flex-col gap-1"></div>
        </div>
      </div>

      <hr className="border-b-full" />

      <div className="flex flex-col gap-2">
        <h3 className="text-xl">Gerenciar categorias</h3>

        <button
          className="py-2 px-4 self-start bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400"
          onClick={() => setOpenedModal("NEW-CATEGORY")}
        >
          Nova categoria
        </button>

        <div className="flex flex-col gap-2">
          <h4 className="text-lg">Categorias existentes</h4>
          <div className="flex flex-col gap-1"></div>
        </div>
      </div>

      {openedModal && createPortal(modals[openedModal], portalRef.current)}
    </div>
  );
}
