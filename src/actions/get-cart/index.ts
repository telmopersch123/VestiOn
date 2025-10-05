"use server";
import { db } from "@/db";
import { cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const getCart = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Usuário não autenticado");
  }
  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });
  if (!cart) {
    const [newCart] = await db
      .insert(cartTable)
      .values({
        userId: session.user.id,
      })
      .returning();

    return {
      ...newCart,
      items: [],
      totalPriceInCents: 0,
    };
  }
  return {
    ...cart,
    totalPriceInCents: cart.items.reduce(
      (total, item) => total + item.productVariant.priceInCents * item.quantity,
      0,
    ),
  };
};

export default getCart;
