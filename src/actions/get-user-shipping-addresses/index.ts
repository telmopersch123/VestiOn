"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth"; // ou next-auth / clerk, ajuste conforme seu setup

export async function getUserShippingAddresses() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Usuário não autenticado");
  }

  const addresses = await db
    .select()
    .from(shippingAddressTable)
    .where(eq(shippingAddressTable.userId, session.user.id));

  return addresses;
}
