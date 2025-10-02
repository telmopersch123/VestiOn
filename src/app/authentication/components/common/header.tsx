"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { LogInIcon, LogOutIcon, MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const { data: sessions } = authClient.useSession();

  return (
    <header className="flex w-full items-center justify-between border-b border-gray-300 py-4">
      <Link href="/">
        <Image src="/logo.png" alt="VestiOn" width={100} height={100} />
      </Link>

      <div className="flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="mr-4">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="mb-4 text-lg font-medium">Menu</SheetTitle>
            </SheetHeader>
            <div className="px-5">
              {sessions?.user ? (
                <div className="flex justify-between space-y-6">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={sessions.user.image || undefined}
                        alt="User Avatar"
                      />
                      <AvatarFallback>
                        {sessions.user.name?.split("")?.[0]?.[0]}
                        {sessions.user.name?.split("")?.[1]?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{sessions?.user?.name}</h3>
                      <span className="text-muted-foreground block text-sm">
                        {sessions?.user?.email}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => authClient.signOut()}
                  >
                    <LogOutIcon />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Olá. Faça o seu Login</h2>
                  <Button variant="outline">
                    <Link href="/authentication">
                      <LogInIcon />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
