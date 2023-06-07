interface IModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export function Modal({ children, onClose }: IModalProps) {
  function handleClose() {
    onClose();
  }

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 bg-[rgba(0,0,0,0.9)] flex justify-center items-center">
      <div
        className="p-4 rounded-md bg-zinc-50"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>

      <button
        type={"submit"}
        className="absolute top-2 right-2 py-2 px-4 bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400"
        onClick={handleClose}
      >
        Fechar Modal
      </button>
    </div>
  );
}
