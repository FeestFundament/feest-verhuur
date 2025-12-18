import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  pricePerDay: number;
  startDate: string;
  endDate: string;
  rentalDays: number;
  itemTotal: number;
  color?: string;
}

interface CheckoutRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  subtotal: number;
  travelCost: number;
  total: number;
}

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user if authenticated (optional)
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await supabaseClient.auth.getUser(token);
      userId = userData.user?.id ?? null;
      logStep("User authenticated", { userId });
    }

    const body: CheckoutRequest = await req.json();
    logStep("Request body received", { 
      customerEmail: body.customerEmail, 
      itemCount: body.items.length,
      total: body.total 
    });

    // Create order in database
    const { data: order, error: orderError } = await supabaseClient
      .from("orders")
      .insert({
        user_id: userId,
        customer_name: body.customerName,
        customer_email: body.customerEmail,
        customer_phone: body.customerPhone,
        customer_address: body.customerAddress,
        subtotal: body.subtotal,
        travel_cost: body.travelCost,
        total: body.total,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      logStep("Order creation failed", { error: orderError });
      throw new Error(`Failed to create order: ${orderError.message}`);
    }
    logStep("Order created", { orderId: order.id });

    // Create order items
    const orderItems = body.items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      price_per_day: item.pricePerDay,
      start_date: item.startDate,
      end_date: item.endDate,
      rental_days: item.rentalDays,
      item_total: item.itemTotal,
      color: item.color,
    }));

    const { error: itemsError } = await supabaseClient
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      logStep("Order items creation failed", { error: itemsError });
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }
    logStep("Order items created", { count: orderItems.length });

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Create line items for Stripe
    const lineItems = body.items.map(item => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: `${item.productName}${item.color ? ` (${item.color})` : ''}`,
          description: `Verhuur: ${item.startDate} t/m ${item.endDate} (${item.rentalDays} dagen)`,
        },
        unit_amount: Math.round(item.itemTotal * 100), // Convert to cents
      },
      quantity: 1,
    }));

    // Add travel cost if applicable
    if (body.travelCost > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Bezorgkosten",
            description: "Transport naar bezorgadres",
          },
          unit_amount: Math.round(body.travelCost * 100),
        },
        quantity: 1,
      });
    }

    // Check if customer exists in Stripe
    const customers = await stripe.customers.list({ email: body.customerEmail, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing Stripe customer found", { customerId });
    }

    const origin = req.headers.get("origin") || "https://feest-fundament.lovable.app";

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : body.customerEmail,
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/betaling-succes?order=${order.id}`,
      cancel_url: `${origin}/winkelwagen`,
      metadata: {
        order_id: order.id,
      },
      payment_intent_data: {
        metadata: {
          order_id: order.id,
        },
      },
    });

    logStep("Stripe session created", { sessionId: session.id, url: session.url });

    // Update order with stripe session id
    await supabaseClient
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id);

    return new Response(JSON.stringify({ url: session.url, orderId: order.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
