"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export function LeadCreator() {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const key = "lead_created_" + user.id;
    if (sessionStorage.getItem(key)) return;

    const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.emailAddresses?.[0]?.emailAddress || "Unknown";
    const email = user.emailAddresses?.[0]?.emailAddress || null;
    const phone = user.phoneNumbers?.[0]?.phoneNumber || null;

    fetch("/api/admin/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, source: "website", status: "new" }),
    })
      .then((res) => {
        if (!res.ok) console.error("LeadCreator: failed", res.status);
        sessionStorage.setItem(key, "1");
      })
      .catch(() => {
        sessionStorage.setItem(key, "1");
      });
  }, [isLoaded, isSignedIn, user]);

  return null;
}
