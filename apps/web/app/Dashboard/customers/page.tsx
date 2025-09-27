// apps/web/app/customers/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import CustomersView from "./view";

export default async function Page() {
  const session = await getServerSession();
  if (!session) redirect("/login");
  return <CustomersView />;
}
