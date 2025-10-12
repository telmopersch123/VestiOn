import { db } from "@/db";
import { cartItemTable, cartTable, orderTable } from "@/db/schema";
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
    const isCartPurchase = checkoutSession.metadata?.isCartPurchase === "true";

    if (!orderId) {
      return NextResponse.error();
    }
    const [order] = await db
      .update(orderTable)
      .set({ status: "paid" })
      .where(eq(orderTable.id, orderId))
      .returning();

    if (!order) return NextResponse.error();

    const cart = await db.query.cartTable.findFirst({
      where: eq(cartTable.userId, order.userId),
    });

    if (!cart) return NextResponse.error();

    if (cart && isCartPurchase) {
      await db.transaction(async (tx) => {
        await tx.delete(cartTable).where(eq(cartTable.id, cart.id));
        await tx.delete(cartItemTable).where(eq(cartItemTable.cartId, cart.id));
      });
    }
  }
  return NextResponse.json({ received: true });
};
