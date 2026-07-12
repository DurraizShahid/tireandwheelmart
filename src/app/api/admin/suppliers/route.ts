import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { ADMIN_DEFAULTS } from "@/lib/admin-constants";

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("business_name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { clerk_user_id, business_name, business_email, business_phone, commission_rate, order_handling } = body;

  if (!business_name) {
    return NextResponse.json({ error: "Business name is required" }, { status: 400 });
  }

  const supabase = createServerClient();

  let targetClerkId = clerk_user_id;

  if (!targetClerkId && business_email) {
    try {
      const client = await clerkClient();
      const existingUsers = await client.users.getUserList({ emailAddress: [business_email] });
      if (existingUsers.data.length > 0) {
        targetClerkId = existingUsers.data[0].id;
      } else {
        const newUser = await client.users.createUser({
          emailAddress: [business_email],
          publicMetadata: { role: "vendor" },
        });
        targetClerkId = newUser.id;
      }
    } catch {
      return NextResponse.json({ error: "Failed to create/find Clerk user" }, { status: 500 });
    }
  }

  if (!targetClerkId) {
    return NextResponse.json({ error: "Either clerk_user_id or business_email is required" }, { status: 400 });
  }

  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(targetClerkId, {
      publicMetadata: { role: "vendor" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to update Clerk user metadata" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("suppliers")
    .insert({
      clerk_user_id: targetClerkId,
      business_name,
      business_email,
      business_phone,
      commission_rate: commission_rate ?? ADMIN_DEFAULTS.DEFAULT_COMMISSION_RATE,
      order_handling: order_handling ?? "admin",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, business_name, business_email, business_phone, commission_rate, order_handling, is_active } = body;

  if (!id) {
    return NextResponse.json({ error: "Supplier ID is required" }, { status: 400 });
  }

  const supabase = createServerClient();
  const updates: Record<string, unknown> = {};
  if (business_name !== undefined) updates.business_name = business_name;
  if (business_email !== undefined) updates.business_email = business_email;
  if (business_phone !== undefined) updates.business_phone = business_phone;
  if (commission_rate !== undefined) updates.commission_rate = commission_rate;
  if (order_handling !== undefined) updates.order_handling = order_handling;
  if (is_active !== undefined) updates.is_active = is_active;

  const { data, error } = await supabase
    .from("suppliers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
