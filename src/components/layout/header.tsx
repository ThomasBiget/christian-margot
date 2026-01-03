"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "ACCUEIL", href: "/" },
  { name: "OEUVRES", href: "/oeuvres" },
  { name: "ACTUALITE", href: "/evenements" },
  { name: "L'ARTISTE", href: "/artiste" },
  { name: "CONTACT", href: "/coordonnees" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Ne pas afficher le header public sur les pages admin
  const isAdminPage = pathname.startsWith("/admin");
  if (isAdminPage) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between py-5">
          <div className="flex-shrink-0">
            <Link href="/" className="group block">
              <div
                className={cn(
                  "leading-tight transition-colors",
                  isScrolled || pathname !== "/" ? "text-primary" : "text-white"
                )}
              >
                <div className="text-3xl md:text-4xl tracking-wider">
                  Christian Margot
                </div>
                <div className="text-xs md:text-sm tracking-[0.2em] uppercase opacity-80 -mt-0.5">
                  artiste plasticien
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm tracking-widest uppercase font-semibold transition-all hover:underline hover:underline-offset-8 hover:decoration-current",
                  item.href === pathname ? "font-bold" : "font-semibold",
                  isScrolled || pathname !== "/" ? "text-primary" : "text-white"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X
                className={
                  isScrolled || pathname !== "/" ? "text-primary" : "text-white"
                }
              />
            ) : (
              <Menu
                className={
                  isScrolled || pathname !== "/" ? "text-primary" : "text-white"
                }
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-background">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-semibold tracking-widest uppercase hover:underline hover:underline-offset-6 hover:decoration-current",
                  item.href === pathname
                    ? "text-accent-foreground bg-accent"
                    : "text-foreground hover:bg-secondary"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
