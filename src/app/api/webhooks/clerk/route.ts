import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CLERK_WEBHOOK_SECRET not set" }, { status: 500 });
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const rawBody = await req.text();
  const signedContent = `${svixId}.${svixTimestamp}.${rawBody}`;
  const expectedSignature = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  ).then((key) =>
    crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedContent))
  ).then((sig) =>
    Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("")
  );

  const signatures = svixSignature.split(" ").map((s) => s.split(",")[1]);
  if (!signatures.some((s) => s === expectedSignature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const body = JSON.parse(rawBody);
  const { type, data } = body;

  if (type === "user.created" || type === "user.updated") {
    const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || "Unknown";
    const email = data.email_addresses?.[0]?.email_address || null;
    const phone = data.phone_numbers?.[0]?.phone_number || null;
    const clerkId = data.id;

    const supabase = createServerClient();

    if (type === "user.created") {
      if (email) {
        const { data: existing } = await supabase.from("leads").select("id").eq("email", email).maybeSingle();
        if (existing) return NextResponse.json({ success: true });
      }
      await supabase.from("leads").insert({
        name, email, phone, source: "website", status: "new",
      });
    }
  }

  return NextResponse.json({ success: true });
}
