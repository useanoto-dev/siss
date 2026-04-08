"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = (path: string) =>
    pathname === path
      ? "font-bold text-primary"
      : "text-muted-foreground hover:text-foreground transition-colors";

  return (
    <nav className="border-b border-solid" aria-label="Navegação principal">
      {/* Barra principal */}
      <div className="flex items-center justify-between px-4 py-4 sm:px-8">
        {/* ESQUERDA: logo + links desktop */}
        <div className="flex items-center gap-6 lg:gap-10">
          <Image src="/logo.svg" width={140} height={31} alt="Vaultly" className="shrink-0 sm:w-[173px]" />
          {/* Links visíveis apenas em md+ */}
          <div className="hidden items-center gap-6 md:flex lg:gap-10">
            <Link href="/" className={linkClass("/")}>Dashboard</Link>
            <Link href="/transactions" className={linkClass("/transactions")}>Transações</Link>
            <Link href="/subscription" className={linkClass("/subscription")}>Assinatura</Link>
          </div>
        </div>

        {/* DIREITA */}
        <div className="flex items-center gap-3">
          <UserButton showName />
          {/* Botão hamburguer — apenas mobile */}
          <button
            className="flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground md:hidden"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <XIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {/* Menu mobile colapsável */}
      {menuOpen && (
        <div className="flex flex-col gap-4 border-t border-solid px-4 py-4 md:hidden">
          <Link href="/" className={linkClass("/")} onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
          <Link href="/transactions" className={linkClass("/transactions")} onClick={() => setMenuOpen(false)}>
            Transações
          </Link>
          <Link href="/subscription" className={linkClass("/subscription")} onClick={() => setMenuOpen(false)}>
            Assinatura
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
