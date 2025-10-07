import { z } from "zod";

export const addressSchema = z.object({
  email: z.email("E-mail inválido"),
  fullName: z.string().min(3, "Nome completo é obrigatório"),
  cpfOrCnpj: z.string().min(11, "CPF inválido"),
  phone: z.string().min(10, "Celular inválido"),
  zipCode: z.string().min(8, "CEP inválido"),
  street: z.string().min(3, "Endereço obrigatório"),
  number: z.string().min(1, "Número obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro obrigatório"),
  city: z.string().min(2, "Cidade obrigatória"),
  state: z.string().min(2, "Estado obrigatório"),
});

export type addressSchema = z.infer<typeof addressSchema>;
