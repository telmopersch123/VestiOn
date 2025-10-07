"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { addressSchema } from "@/actions/address-cart/schema";
import { useCreateShippingAddress } from "@/hooks/mutations/use-Create-Shipping-Address";

import { z } from "zod";

type AddressFormData = z.infer<typeof addressSchema>;

export default function AddNewAddressForm() {
  const mutation = useCreateShippingAddress();
  const isLoading = mutation.isPending;
  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      email: "",
      fullName: "",
      cpfOrCnpj: "",
      phone: "",
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const onSubmit = (data: AddressFormData) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success("Endereço adicionado com sucesso!");
        form.reset();
      },
      onError: (err: any) => {
        toast.error(err?.message || "Erro ao salvar endereço");
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto mt-2 max-w-lg space-y-5 rounded-2xl bg-white p-6 shadow-sm"
      >
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nome completo */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CPF */}
        <FormField
          control={form.control}
          name="cpfOrCnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <PatternFormat
                  format="###.###.###-##"
                  mask="_"
                  customInput={Input}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Celular */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Celular</FormLabel>
              <FormControl>
                <PatternFormat
                  format="(##) #####-####"
                  mask="_"
                  customInput={Input}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CEP */}
        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <PatternFormat
                  format="#####-###"
                  mask="_"
                  customInput={Input}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Endereço */}
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Número e Complemento */}
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="complement"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Complemento</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Bairro */}
        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cidade e Estado */}
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="mt-2 w-full">
          {isLoading ? "Salvando..." : "Salvar endereço"}
        </Button>
      </form>
    </Form>
  );
}
