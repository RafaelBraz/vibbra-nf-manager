import { CategoryType } from "@/types/category,type";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Modal } from "../Modal";
import { CreateCategoryForm } from "../CreateCategoryForm";
import { UpdateCategoryForm } from "../UpdateCategoryForm";

interface ICategoriesListProps {}

type OpenedModalType = "NEW-CATEGORY" | "UPDATE-CATEGORY" | null;

export function CategoriesList({}: ICategoriesListProps) {
  const { data: session } = useSession();
  const portalRef = useRef<any>(null);
  const [openedModal, setOpenedModal] = useState<OpenedModalType>(null);
  const [categories, setCategories] = useState<Partial<CategoryType>[]>([]);
  const [updateCategory, setUpdateCategory] =
    useState<Partial<CategoryType> | null>(null);

  useEffect(() => {
    portalRef.current = document.querySelector("#modal-portal");
  }, []);

  useEffect(() => {
    if (session?.user) {
      const userId = session?.user.id;

      axios(`/api/categories/${userId}`, {
        method: "GET",
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      }).then((res) => {
        if (res.status !== 200) {
          alert("Erro ao carregar categorias.");
        }
        if (res.data.categories.length > 0) {
          setCategories([...res.data.categories]);
        }
      });
    }
  }, [session?.user]);

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

    setOpenedModal("UPDATE-CATEGORY");
    setUpdateCategory(category);
  }

  function handleModalClose() {
    setOpenedModal(null);
  }

  function onCreate(category: CategoryType) {
    setCategories((prev) => [...prev, category]);
  }

  function onUpdate(updatedCategory: CategoryType) {
    setCategories((prev) => [
      ...prev.map((category) => {
        if (category.id === updatedCategory.id) return updatedCategory;
        return category;
      }),
    ]);
  }

  const modals = {
    "NEW-CATEGORY": (
      <Modal onClose={handleModalClose}>
        <CreateCategoryForm onCreate={onCreate} onClose={handleModalClose} />
      </Modal>
    ),
    "UPDATE-CATEGORY": updateCategory && (
      <Modal onClose={handleModalClose}>
        <UpdateCategoryForm
          value={updateCategory}
          onUpdate={onUpdate}
          onClose={handleModalClose}
        />
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
        onClick={() => setOpenedModal("NEW-CATEGORY")}
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
