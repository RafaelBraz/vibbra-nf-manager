import { CreatePartnerForm } from "../CreatePartnerForm";
import { SettingsForm } from "../SettingsForm";

interface IPreferencesMenuProps {}

export function PreferencesMenu({}: IPreferencesMenuProps) {
  return (
    <div className="p-4 w-full flex flex-col gap-2 bg-zinc-50">
      <h2 className="text-2xl">Menu de preferências</h2>

      <hr className="border-b-full" />

      <SettingsForm />

      <hr className="border-b-full" />

      <h3></h3>

      <div className="w-full flex gap-4 items-center">
        <button className="py-2 px-4 bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400">
          Nova empresa parceira
        </button>

        <button className="py-2 px-4 bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400">
          Nova categoria
        </button>
      </div>

      <CreatePartnerForm />
    </div>
  );
}
