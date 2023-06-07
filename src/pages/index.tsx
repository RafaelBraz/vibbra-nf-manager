import { BillingMenu } from "@/components/BillingMenu";
import { Dashboard } from "@/components/Dashboard";
import { PreferencesMenu } from "@/components/PreferencesMenu";

export default function Home() {
  return (
    <div className="p-1 w-full flex gap-1">
      <BillingMenu />
      <Dashboard />
      <PreferencesMenu />
    </div>
  );
}
