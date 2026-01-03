"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  // Ne pas afficher le footer public sur les pages admin
  const isAdminPage = pathname.startsWith("/admin");
  if (isAdminPage) {
    return null;
  }

  return (
    <footer className="bg-secondary py-8 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-playfair mb-4">Christian Margot</h3>
            <p className="text-muted-foreground text-sm">
              Exploration artistique à travers la peinture, le collage, le stylo
              et le modelage.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-playfair mb-4">Liens</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/oeuvres"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mes Œuvres
                </Link>
              </li>
              <li>
                <Link
                  href="/coordonnees"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Coordonnées
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-playfair mb-4">Légal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="/politique-confidentialite"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-center text-muted-foreground">
            © {currentYear} L&apos;Artiste. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
