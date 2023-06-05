import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>Home</h1>
      <p>{session?.user?.email}</p>
    </div>
  );
}