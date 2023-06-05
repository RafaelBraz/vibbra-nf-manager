import { signIn, signOut, useSession } from "next-auth/react";

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

  if (session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-24">
      <button
        className="py-2 px-4 bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400"
        onClick={handleSignIn}
      >
        Logar
      </button>
    </div>
  );
}
