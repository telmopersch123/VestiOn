"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useState } from "react";
import AddressForm from "./form-adresses";

import { shippingAddressTable } from "@/db/schema";

import {
  getUserAddressesKey,
  useUserShippingAddresses,
} from "@/hooks/queries/use-User-Shipping-Addresses";
import { useQueryClient } from "@tanstack/react-query";

interface AddressProp {
  shippingAddresses: (typeof shippingAddressTable.$inferSelect)[];
}

const Addresses = ({ shippingAddresses }: AddressProp) => {
  const [selectedAddres, setSelectedAddres] = useState<string | null>();
  const { data: addresses, isLoading } = useUserShippingAddresses({
    initialData: shippingAddresses,
  });
  const queryClient = useQueryClient();

  if (isLoading) return <p>Carregando endereços...</p>;

  return (
    <Card className="mt-2">
      <CardHeader>
        <CardTitle>Identificação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={selectedAddres}
          onValueChange={setSelectedAddres}
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

        {/* Formulário só aparece se selectedAddres === "add_new" */}
        {selectedAddres === "add_new" && (
          <AddressForm
            onSuccess={() =>
              queryClient.invalidateQueries({ queryKey: getUserAddressesKey() })
            }
          />
        )}
      </CardContent>
    </Card>
  );
};

export default Addresses;
