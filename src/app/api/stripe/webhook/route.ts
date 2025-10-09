import { db } from "@/db";
import { orderTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (request: Request) => {
  const signature = request.headers.get("Stripe-Signature");
  if (!signature) {
    return NextResponse.error();
  }
  const body = await request.text();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET_KEY!,
  );
  if (event.type === "checkout.session.completed") {
    console.log("checkout.session.completed");
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    const orderId = checkoutSession.metadata?.orderId;
    if (!orderId) {
      return NextResponse.error();
    }
    await db
      .update(orderTable)
      .set({ status: "paid" })
      .where(eq(orderTable.id, orderId));
  }
  return NextResponse.json({ received: true });
};
