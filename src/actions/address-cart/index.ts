"use server";

import { db } from "@/db"; // ajuste o caminho conforme seu projeto
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth"; // se estiver usando next-auth ou clerk, ajuste

import { headers } from "next/headers";
import { z } from "zod";
import { addressSchema } from "./schema";

export async function createShippingAddress(
  data: z.infer<typeof addressSchema>,
) {
  addressSchema.parse(data);
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Usuário não autenticado");
  }
  try {
    await db.insert(shippingAddressTable).values({
      userId: session.user.id,
      recipientName: data.fullName,
      street: data.street,
      number: data.number,
      complement: data.complement,
      city: data.city,
      state: data.state,
      neighborhood: data.neighborhood,
      zipCode: data.zipCode,
      country: "Brasil",
      phone: data.phone,
      email: data.email,
      cpfOrCnpj: data.cpfOrCnpj,
    });

    return { success: true };
  } catch (err) {
    console.error("Erro ao criar endereço:", err);
    return { success: false, error: "Erro ao salvar endereço." };
  }
}
