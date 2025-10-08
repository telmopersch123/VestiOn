"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { db } from "@/db";
import { orderItemTable, orderTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import {
  CreateCheckoutSessionsSchema,
  createCheckoutSessionSchema,
} from "./schema";

export const createCheckoutSessions = async (
  data: CreateCheckoutSessionsSchema,
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Usuário não autenticado");
  }

  const { orderId } = createCheckoutSessionSchema.parse(data);

  const order = await db.query.orderTable.findFirst({
    where: eq(orderTable.id, orderId),
  });
  // validações
  if (!order) {
    throw new Error("Pedido nao encontrado");
  }
  if (order.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const orderItems = await db.query.orderItemTable.findMany({
    where: eq(orderItemTable.orderId, orderId),
    with: {
      productVariant: { with: { product: true } },
    },
  });

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "STRIPE_SECRET_KEY is not defined in environment variables",
    );
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
    metadata: {
      orderId,
    },
    line_items: orderItems.map((item) => {
      return {
        price_data: {
          currency: "brl",
          product_data: {
            name: `${item.productVariant.product.name} - ${item.productVariant.name}`,
            description: item.productVariant.product.description,
            images: [item.productVariant.imageUrl],
          },
          // em centavos
          unit_amount: item.priceInCents,
        },
        quantity: item.quantity,
      };
    }),
  });
  return { id: checkoutSession.id };
};
