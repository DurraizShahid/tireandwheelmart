import { redirect } from "next/navigation";

export default function EmailAutomationsRedirect() {
  redirect("/admin/communications");
}
