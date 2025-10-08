export const formatAddress = (address: {
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}) => {
  return `   ${address.street}, ${address.number} 
                      ${address.complement ? `- ${address.complement}` : ""}
                      ${address.neighborhood}, ${address.city} - ${address.state} -
                   
                      CEP: ${address.zipCode} - ${address.phone}`;
};
