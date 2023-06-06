import { FormEvent, useState } from "react";
import { ToggleButton } from "../ToggleButton";
import { useSession } from "next-auth/react";
import axios from "axios";

interface ISettingsFormProps {}

export function SettingsForm({}: ISettingsFormProps) {
  const { data: session } = useSession();

  const [settings, setSettings] = useState({
    MEILimit: session?.user?.MEILimit ?? 81000,
    notificationEmail: session?.user?.emailAlert ?? false,
    notificationSMS: session?.user?.smsAlert ?? false,
  });

  if (!session) {
    return <p>Loading...</p>;
  }

  function handleSettingsChange(name: string, value: number | boolean) {
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent) {
    try {
      event.preventDefault();

      const res = await axios(`/api/user/${session?.user.id}`, {
        method: "PATCH",
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        data: {
          MEILimit: settings.MEILimit,
          emailAlert: settings.notificationEmail,
          smsAlert: settings.notificationSMS,
        },
      });

      if (res.status === 500) {
        throw new Error("Erro na atualização das preferências.");
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        throw error;
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h3 className="text-xl">Configurações</h3>

      <div className="flex items-center justify-between gap-4">
        <h4 className="text-lg">Limite de faturamento anual: </h4>

        <input
          className="p-2 outline-none border-2 rounded-md focus:border-zinc-900"
          type="number"
          name="limit"
          value={settings.MEILimit}
          onChange={(e) =>
            handleSettingsChange("MEILimit", Number(e.target.value))
          }
        />
      </div>

      <div className="flex flex-col items-start gap-4">
        <h4 className="text-lg">Notificações e Alertas: </h4>

        <div className="w-full flex justify-between items-center gap-4">
          <h5>Receber por E-mail</h5>

          <ToggleButton
            value={settings.notificationEmail}
            onChange={(value) =>
              handleSettingsChange("notificationEmail", value)
            }
          />
        </div>

        <div className="w-full flex justify-between items-center gap-4">
          <h5>Receber por SMS</h5>

          <ToggleButton
            value={settings.notificationSMS}
            onChange={(value) => handleSettingsChange("notificationSMS", value)}
          />
        </div>

        <button
          type={"submit"}
          className="py-2 px-4 bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400"
        >
          Atualizar
        </button>
      </div>
    </form>
  );
}
