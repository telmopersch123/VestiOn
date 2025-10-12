"use client";

import { usePathname } from "next/navigation";
import React, { useLayoutEffect, useState } from "react";
import Loading from "./loading";

export default function ClientLoaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true); // mostra no 1º load tbm

  useLayoutEffect(() => {
    // mostra imediatamente antes da nova rota renderizar
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 400); // ajustável — evita piscar rápido demais

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {loading && <Loading />}
      {children}
    </>
  );
}
