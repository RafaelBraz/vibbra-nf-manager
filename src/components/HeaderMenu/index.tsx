import { useSession } from "next-auth/react";

interface IHeaderMenuProps {
  onSignOut: () => void;
}

export function HeaderMenu({ onSignOut }: IHeaderMenuProps) {
  const { data: session } = useSession();
  const user = session?.user;

  function handleSignOut() {
    onSignOut();
  }

  return (
    <div className="p-4 w-full flex justify-between items-center bg-zinc-200">
      <h2>{`CNPJ: ${user?.cnpj} | Razão social: ${user?.companyName}`}</h2>

      <button
        className="py-2 px-4 bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400"
        onClick={handleSignOut}
      >
        Desconectar
      </button>
    </div>
  );
}
