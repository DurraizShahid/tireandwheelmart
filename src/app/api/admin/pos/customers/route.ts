import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createPOSService } from "@/lib/services/pos-service";

export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const pos = createPOSService(supabase);
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") ?? "";
  const id = searchParams.get("id");

  try {
    if (id) {
      const customer = await pos.getCustomerById(id);
      if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
      const orders = await pos.getCustomerOrders(id);
      return NextResponse.json({ customer, orders });
    }

    const customers = await pos.searchCustomers(query);
    return NextResponse.json(customers);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const data = await req.json();

  if (!data.email && (!data.first_name || !data.last_name)) {
    return NextResponse.json({ error: "Email or name is required" }, { status: 400 });
  }

  try {
    const { data: customer, error } = await supabase
      .from("customers")
      .insert({
        email: data.email || null,
        first_name: data.first_name || "Walk-in",
        last_name: data.last_name || "Customer",
        phone: data.phone || null,
      })
      .select("id, first_name, last_name, email, phone")
      .single();

    if (error) throw error;
    return NextResponse.json(customer, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
