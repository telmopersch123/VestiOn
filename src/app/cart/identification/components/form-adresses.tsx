"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { z } from "zod";

const addressSchema = z.object({
  email: z.string().email("E-mail inválido"),
  fullName: z.string().min(3, "Nome muito curto"),
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
  phone: z.string().min(14, "Celular inválido (use DDD + número)"),
  cep: z.string().min(9, "CEP inválido (use formato 00000-000)"),
  address: z.string().min(3, "Endereço obrigatório"),
  number: z.string().min(1, "Número obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro obrigatório"),
  city: z.string().min(2, "Cidade obrigatória"),
  state: z.string().min(2, "Estado obrigatório"),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddNewAddressFormProps {
  selectedAddress: string;
}

export default function AddNewAddressForm({
  selectedAddress,
}: AddNewAddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  if (selectedAddress !== "add_new") return null;

  const onSubmit = (data: AddressFormData) => {
    console.log("Novo endereço adicionado:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl bg-white p-6 shadow-lg"
    >
      {/* Linha 1 */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            {...register("email")}
            placeholder="seuemail@exemplo.com"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="fullName">Nome completo</Label>
          <Input
            id="fullName"
            {...register("fullName")}
            placeholder="Digite seu nome completo"
          />
          {errors.fullName && (
            <p className="text-sm text-red-500">{errors.fullName.message}</p>
          )}
        </div>
      </div>

      {/* Linha 2 */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <PatternFormat
            id="cpf"
            format="###.###.###-##"
            customInput={Input}
            placeholder="000.000.000-00"
            onValueChange={(values) => setValue("cpf", values.value)}
          />
          {errors.cpf && (
            <p className="text-sm text-red-500">{errors.cpf.message}</p>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="phone">Celular</Label>
          <PatternFormat
            id="phone"
            format="(##) #####-####"
            customInput={Input}
            placeholder="(00) 00000-0000"
            onValueChange={(values) => setValue("phone", values.formattedValue)}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="cep">CEP</Label>
          <PatternFormat
            id="cep"
            format="#####-###"
            customInput={Input}
            placeholder="00000-000"
            onValueChange={(values) => setValue("cep", values.formattedValue)}
          />
          {errors.cep && (
            <p className="text-sm text-red-500">{errors.cep.message}</p>
          )}
        </div>
      </div>

      {/* Linha 3 */}
      <div className="flex flex-col space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          {...register("address")}
          placeholder="Rua, avenida, etc."
        />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address.message}</p>
        )}
      </div>

      {/* Linha 4 */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="number">Número</Label>
          <Input id="number" {...register("number")} placeholder="123" />
          {errors.number && (
            <p className="text-sm text-red-500">{errors.number.message}</p>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            {...register("complement")}
            placeholder="Apto, bloco, etc. (opcional)"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input
            id="neighborhood"
            {...register("neighborhood")}
            placeholder="Centro"
          />
          {errors.neighborhood && (
            <p className="text-sm text-red-500">
              {errors.neighborhood.message}
            </p>
          )}
        </div>
      </div>

      {/* Linha 5 */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input id="city" {...register("city")} placeholder="Ex: São Paulo" />
          {errors.city && (
            <p className="text-sm text-red-500">{errors.city.message}</p>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input id="state" {...register("state")} placeholder="Ex: SP" />
          {errors.state && (
            <p className="text-sm text-red-500">{errors.state.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="mt-4 w-full md:w-auto">
        Salvar endereço
      </Button>
    </form>
  );
}
