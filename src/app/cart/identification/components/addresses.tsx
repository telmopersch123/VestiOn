"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useState } from "react";
import AddressForm from "./form-adresses";

const Addresses = () => {
  const [selectedAddres, setSelectedAddres] = useState<string | null>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identificação</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedAddres} onValueChange={setSelectedAddres}>
          <Card>
            <CardContent>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="add_new" id="add_new" />
                <Label htmlFor="add_new">Adicionar novo endereço</Label>
              </div>
            </CardContent>
          </Card>
        </RadioGroup>
        {selectedAddres === "add_new" && <AddressForm />}
      </CardContent>
    </Card>
  );
};

export default Addresses;
