import { isAdminAuthenticated } from "@/lib/auth";
import { AdminApp } from "./components/AdminApp";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();
  return <AdminApp initialAuthenticated={authenticated} />;
}
