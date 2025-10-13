"use client";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";

import MenuBar from "../menu/MenuBar";
import Cart from "./cart";
import Loading from "./loading";

const Header = () => {
  const session = authClient.useSession().data;
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  return (
    <>
      {isLoading && pathname !== "/" && <Loading />}
      <header className="mb-4 flex h-20 w-full items-center justify-between">
        <Link
          onClick={() => {
            setIsLoading(true);
          }}
          href="/"
        >
          <Image
            className="ml-5 rounded-full"
            src="/logo.svg"
            alt="VestiOn"
            width={120}
            height={120}
          />
        </Link>

        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="mr-4 cursor-pointer">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="mb-4 text-lg font-medium">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <MenuBar />
            </SheetContent>
          </Sheet>
          {session?.user && <Cart />}
        </div>
      </header>
    </>
  );
};

export default Header;
