import { auth, currentUser } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SignUpCompletePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  if (!user) redirect("/");

  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.emailAddresses[0]?.emailAddress || "Unknown";
  const email = user.emailAddresses[0]?.emailAddress || null;
  const phone = user.phoneNumbers[0]?.phoneNumber || null;

  try {
    const supabase = createServerClient();
    if (email) {
      const { data: existing } = await supabase.from("leads").select("id").eq("email", email).maybeSingle();
      if (!existing) {
        await supabase.from("leads").insert({ name, email, phone, source: "website", status: "new" });
      }
    } else {
      await supabase.from("leads").insert({ name, email, phone, source: "website", status: "new" });
    }
  } catch {
    // Lead creation is best-effort; don't block signup
  }

  redirect("/");
}
