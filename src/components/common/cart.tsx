import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingBasketIcon } from "lucide-react";
import { Button } from "../ui/button";
const Cart = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="mr-4">
          <ShoppingBasketIcon />
        </Button>
      </SheetTrigger>
      <SheetContent></SheetContent>
    </Sheet>
  );
};

export default Cart;
