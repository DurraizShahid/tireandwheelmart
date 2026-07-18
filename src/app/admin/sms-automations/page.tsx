import { redirect } from "next/navigation";

export default function SMSAutomationsRedirect() {
  redirect("/admin/communications");
}
