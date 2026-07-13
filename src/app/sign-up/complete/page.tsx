"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SignUpCompletePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !user) {
      router.replace("/sign-in");
      return;
    }

    const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.emailAddresses?.[0]?.emailAddress || "Unknown";
    const email = user.emailAddresses?.[0]?.emailAddress || null;
    const phone = user.phoneNumbers?.[0]?.phoneNumber || null;

    fetch("/api/admin/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, source: "website", status: "new" }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Unknown error" }));
          toast.error(`Lead creation failed: ${err.error}`);
          console.error("Lead creation failed:", err);
        } else {
          console.log("Lead created successfully");
        }
      })
      .catch((err) => {
        toast.error("Could not create lead");
        console.error("Lead creation error:", err);
      })
      .finally(() => router.replace("/"));
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
