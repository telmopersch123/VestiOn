import z from "zod";

export const createCheckoutSessionSchema = z.object({
  orderId: z.uuid(),
});

export type CreateCheckoutSessionsSchema = z.infer<
  typeof createCheckoutSessionSchema
>;
