import { CategoryType } from "@/types/category,type";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { Modal } from "../Modal";
import { CreateCategoryForm } from "../CreateCategoryForm";
import { UpdateCategoryForm } from "../UpdateCategoryForm";
import { fetcher } from "@/lib/swr/fetcher";

type OpenedModalType = "NEW" | "UPDATE" | null;
type SWRDataType = {
  categories: CategoryType[];
};

export function CategoriesList() {
  const { data: session } = useSession();
  const user = session?.user;
  const portalRef = useRef<any>(null);
  const [openedModal, setOpenedModal] = useState<OpenedModalType>(null);
  const [updateCategory, setUpdateCategory] =
    useState<Partial<CategoryType> | null>(null);

  useEffect(() => {
    portalRef.current = document.querySelector("#modal-portal");
  }, []);

  const { data, error, isLoading } = useSWR<SWRDataType>(
    `/api/categories/${user?.id ?? ""}`,
    fetcher
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Erro ao carregar categorias.</p>;
  }

  const categories = data?.categories ?? [];

  function handleCategoryUpdate(id?: string) {
    if (!id) {
      alert("Erro ao carregar categoria.");
      return;
    }

    const category = categories.find((category) => category.id === id);

    if (!category) {
      alert("Erro ao carregar categoria.");
      return;
    }

    setOpenedModal("UPDATE");
    setUpdateCategory(category);
  }

  function handleModalClose() {
    setOpenedModal(null);
  }

  const modals = {
    NEW: (
      <Modal onClose={handleModalClose}>
        <CreateCategoryForm onClose={handleModalClose} />
      </Modal>
    ),
    UPDATE: updateCategory && (
      <Modal onClose={handleModalClose}>
        <UpdateCategoryForm value={updateCategory} onClose={handleModalClose} />
      </Modal>
    ),
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="py-2 text-xl border-y-2 border-zinc-200">
        Gerenciar categorias
      </h3>

      <button
        className="py-2 px-4 self-start bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400"
        onClick={() => setOpenedModal("NEW")}
      >
        Nova categoria
      </button>

      <div className="flex flex-col gap-2">
        <h4 className="text-lg">Categorias existentes</h4>

        <div className="max-h-64 flex flex-col gap-1 overflow-auto">
          {categories.map((category) => (
            <div
              key={category.id}
              className="w-full flex border-2 border-zinc-300 rounded-md overflow-hidden"
            >
              <h5 className="py-2 px-4">{category.name}</h5>

              <button
                className="py-2 px-4 ml-auto text-zinc-900 hover:bg-zinc-300"
                onClick={() => handleCategoryUpdate(category.id)}
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
