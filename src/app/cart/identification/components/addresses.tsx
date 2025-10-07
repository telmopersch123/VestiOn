"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import AddressForm from "./form-adresses";

import { Button } from "@/components/ui/button";
import { useUpdateCartShippingAddress } from "@/hooks/mutations/use-Update-Cart-Shipping-Address";
import { getUseCartQueryKey } from "@/hooks/queries/use-card";
import {
  getUserAddressesKey,
  useUserShippingAddresses,
} from "@/hooks/queries/use-User-Shipping-Addresses";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AddressProp {
  shippingAddresses: any[];
  defaultCart: string | null;
}

const Addresses = ({ shippingAddresses, defaultCart }: AddressProp) => {
  const [selectedAddres, setSelectedAddres] = useState<string | null>(
    defaultCart || null,
  );
  const { data: addresses, isLoading } = useUserShippingAddresses({
    initialData: shippingAddresses,
  });
  const queryClient = useQueryClient();
  const updateCart = useUpdateCartShippingAddress();

  if (isLoading) return <p>Carregando endereços...</p>;

  const handleSelectAddress = (id: string, validar: boolean) => {
    setSelectedAddres(id);

    if (id !== "add_new") {
      updateCart.mutate(
        { shippingAddressId: id },
        {
          onSuccess: () => {
            if (!validar) {
              toast.success("Endereço selecionado com sucesso!");
            }

            queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
          },
          onError: (err: any) => {
            toast.error(
              err?.message || "Erro ao atualizar endereço do carrinho",
            );
          },
        },
      );
    }
  };

  const handleNewAddressCreated = (newAddressId: string) => {
    // Seleciona o novo endereço automaticamente
    setSelectedAddres(newAddressId);

    // Atualiza o carrinho com o novo endereço
    updateCart.mutate(
      { shippingAddressId: newAddressId },
      {
        onSuccess: () => {
          toast.success("Novo endereço adicionado e selecionado!");
          queryClient.invalidateQueries({ queryKey: getUserAddressesKey() });
          queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
        },
        onError: (err: any) => {
          toast.error(
            err?.message || "Erro ao vincular o endereço ao carrinho",
          );
        },
      },
    );
  };

  return (
    <Card className="mt-2">
      <CardHeader>
        <CardTitle>Identificação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={selectedAddres}
          onValueChange={(value) => handleSelectAddress(value, false)}
          className="space-y-2"
        >
          {addresses?.map((address) => (
            <Card key={address.id} className="border border-gray-200">
              <CardContent>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={address.id} id={address.id} />
                  <div>
                    <Label htmlFor={address.id} className="font-semibold">
                      {address.recipientName}
                    </Label>
                    <p className="text-sm text-gray-600">
                      {address.street}, {address.number}{" "}
                      {address.complement && `- ${address.complement}`} <br />
                      {address.neighborhood}, {address.city} - {address.state}{" "}
                      <br />
                      CEP: {address.zipCode} | {address.phone}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Adicionar novo endereço */}
          <Card className="border border-gray-200">
            <CardContent>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="add_new" id="add_new" />
                <Label htmlFor="add_new">Adicionar novo endereço</Label>
              </div>
            </CardContent>
          </Card>
        </RadioGroup>

        {selectedAddres === "add_new" ? (
          <AddressForm
            onSuccess={(newAddressId: string) =>
              handleNewAddressCreated(newAddressId)
            }
          />
        ) : selectedAddres ? (
          <Button
            onClick={() => handleSelectAddress(selectedAddres, true)}
            disabled={updateCart.isPending}
            className="mt-2 w-full"
          >
            {updateCart.isPending
              ? "Atualizando..."
              : "Continuar com o pagamento"}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default Addresses;
