import { signIn, signOut, useSession } from "next-auth/react";
import { CreateProviderUserForm } from "../CreateProviderUserForm";
import { useState } from "react";
import { CreateUserForm } from "../CreateUserForm";
import { HeaderMenu } from "../HeaderMenu";

interface IAuthProps {
  children: React.ReactNode;
}

export default function Auth({ children }: IAuthProps) {
  const { data: session } = useSession();
  const [register, setRegister] = useState(false);
  const [registered, setRegistered] = useState(false);

  function handleSignIn() {
    signIn();
  }

  function handleSignOut() {
    signOut();
  }

  if (session) {
    if (!session.user) {
      return <CreateProviderUserForm />;
    }

    return (
      <>
        <HeaderMenu onSignOut={handleSignOut} />
        {children}
      </>
    );
  }

  if (register) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center gap-4">
        <CreateUserForm
          onSubmit={() => {
            setRegister(false);
            setRegistered(true);
          }}
        />

        <button type={"button"} onClick={() => setRegister(false)}>
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center gap-4">
      {registered && <p>Usuário registrado com sucesso.</p>}
      <button
        className="py-2 px-4 bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400"
        onClick={handleSignIn}
      >
        Logar
      </button>
      <button
        className="py-2 px-4 bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400"
        onClick={() => setRegister(true)}
      >
        Registrar
      </button>
    </div>
  );
}
