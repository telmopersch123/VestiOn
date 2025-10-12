import { authClient } from "@/lib/auth-client";
import { Loader2, LogInIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

type CategorieProps = {
  id: string;
  createdAt: Date;
  name: string;
  slug: string;
};

const MenuBar = () => {
  const { data: sessions } = authClient.useSession();
  const [loggingOut, setLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategorieProps[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="flex h-full flex-col justify-between px-6 py-5">
      {sessions?.user ? (
        <>
          {/* --- TOPO: informações do usuário --- */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <Avatar className="h-12 w-12 ring-2 ring-gray-200">
                <AvatarImage
                  src={sessions.user.image || undefined}
                  alt="User Avatar"
                />
                <AvatarFallback className="font-medium">
                  {sessions.user.name?.charAt(0)}
                  {sessions.user.name?.split(" ")[1]?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {sessions.user.name}
                </h3>
                <span className="text-sm text-gray-500">
                  {sessions.user.email}
                </span>
              </div>
            </div>

            {/* --- MENU PRINCIPAL --- */}
            <div className="flex flex-col gap-2 text-[15px] font-medium text-gray-700">
              <Link href="/">
                <p className="smooth-shadow text-center">Início</p>
              </Link>
              <Link href="/my-orders">
                <p className="smooth-shadow text-center">Meus Pedidos</p>
              </Link>
            </div>

            <Separator className="my-5" />

            {/* --- CATEGORIAS --- */}
            <div className="flex flex-col gap-3 text-[15px] font-medium text-gray-600">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {categories.map((cat) => (
                <Link key={cat.id} href={`/category/${cat.slug}`}>
                  <p
                    key={cat.id}
                    className="cursor-pointer transition hover:text-black"
                  >
                    {cat.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* --- RODAPÉ (sair da conta) --- */}
          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <p className="font-semibold text-gray-800">Sair da conta</p>
            <Button
              variant="outline"
              disabled={loggingOut}
              onClick={async () => {
                try {
                  setLoggingOut(true);
                  await authClient.signOut();
                } finally {
                  setLoggingOut(false);
                }
              }}
              className="cursor-pointer"
            >
              {loggingOut && <Loader2 className="h-4 w-4 animate-spin" />}
              <LogOutIcon />
            </Button>
          </div>
        </>
      ) : (
        <div className="flex w-full items-center justify-between">
          <h2 className="font-semibold text-gray-800">Olá. Faça o seu Login</h2>
          <Link href="/authentication">
            <Button className="cursor-pointer" variant="outline">
              {loggingOut && <Loader2 className="h-4 w-4 animate-spin" />}
              <LogInIcon />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MenuBar;
