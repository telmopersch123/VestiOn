"use server";

import { db } from "@/db";
import { cartTable, orderItemTable, orderTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export const finishOrder = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Usuário não autenticado");
  }

  const cart = await db.query.cartTable.findFirst({
    where: eq(cartTable.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: true,
        },
      },
    },
  });
  if (!cart) {
    throw new Error("Carrinho nao encontrado");
  }

  if (!cart.shippingAddress) {
    throw new Error("Endereço de entrega nao encontrado");
  }

  const totalPriceInCents = cart.items.reduce((total, item) => {
    return total + item.productVariant.priceInCents * item.quantity;
  }, 0);
  let orderId: string | undefined;
  await db.transaction(async (tx) => {
    const [order] = await tx
      .insert(orderTable)
      .values({
        userId: session.user.id,
        shippingAddressId: cart.shippingAddress!.id,
        recipientName: cart.shippingAddress!.recipientName,
        street: cart.shippingAddress!.street,
        number: cart.shippingAddress!.number,
        complement: cart.shippingAddress!.complement,
        city: cart.shippingAddress!.city,
        state: cart.shippingAddress!.state,
        neighborhood: cart.shippingAddress!.neighborhood,
        zipCode: cart.shippingAddress!.zipCode,
        country: cart.shippingAddress!.country,
        phone: cart.shippingAddress!.phone,
        email: cart.shippingAddress!.email,
        cpfOrCnpj: cart.shippingAddress!.cpfOrCnpj,
        totalPriceInCents,
      })
      .returning();

    if (!order) {
      throw new Error("Erro ao criar pedido");
    }
    orderId = order.id;
    const orderItemsPayload: Array<typeof orderItemTable.$inferInsert> =
      cart.items.map((item) => ({
        orderId: order.id,
        productVariantId: item.productVariant.id,
        quantity: item.quantity,
        priceInCents: item.productVariant.priceInCents,
      }));
    await tx.insert(orderItemTable).values(orderItemsPayload);
  });
  return { orderId };
};
