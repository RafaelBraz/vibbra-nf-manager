import { SettingsForm } from "../SettingsForm";
import { CategoriesList } from "../CategoriesList";
import { PartnersList } from "../PartnersList";

interface IPreferencesMenuProps {}

export function PreferencesMenu({}: IPreferencesMenuProps) {
  return (
    <div className="p-4 w-full flex flex-col gap-2 basis-1 bg-zinc-50">
      <h2 className="text-2xl">Menu de preferências</h2>

      <SettingsForm />
      <PartnersList />
      <CategoriesList />
    </div>
  );
}
