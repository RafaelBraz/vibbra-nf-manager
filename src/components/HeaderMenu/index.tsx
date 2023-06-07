interface IHeaderMenuProps {
  onSignOut: () => void;
}

export function HeaderMenu({ onSignOut }: IHeaderMenuProps) {
  function handleSignOut() {
    onSignOut();
  }

  return (
    <div className="p-4 w-full bg-zinc-200 flex justify-end">
      <button
        className="py-2 px-4 bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400"
        onClick={handleSignOut}
      >
        Desconectar
      </button>
    </div>
  );
}
