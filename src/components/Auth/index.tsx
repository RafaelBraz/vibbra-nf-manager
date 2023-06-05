import { signIn, signOut, useSession } from "next-auth/react";
import { CreateUserForm } from "../CreateUserForm";

interface IAuthProps {
  children: React.ReactNode;
}

export default function Auth({ children }: IAuthProps) {
  const { data: session } = useSession();

  function handleSignIn() {
    signIn();
  }

  function handleSignOut() {
    signOut();
  }

  if (session && session.user) {
    return (
      <>
        <menu className="p-4 w-full bg-zinc-200 flex justify-end">
          <button
            className="py-2 px-4 bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400"
            onClick={handleSignOut}
          >
            Desconectar
          </button>
        </menu>
        {children}
      </>
    );
  }

  if (session && !session.user) {
    return <CreateUserForm />;
  }

  return (
    <div>
      <button
        className="py-2 px-4 bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400"
        onClick={handleSignIn}
      >
        Logar
      </button>
    </div>
  );
}
