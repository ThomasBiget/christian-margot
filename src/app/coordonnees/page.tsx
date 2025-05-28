import { MapPin, Mail, Phone, Instagram } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Coordonnées | Portfolio Artistique",
  description:
    "Contactez l'artiste pour toute information sur les œuvres, expositions ou projets de collaboration.",
};

export default function ContactPage() {
  return (
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-playfair mb-8 text-center">
          Coordonnées
        </h1>

        <div className="bg-white shadow-sm rounded-lg p-8 mt-12">
          <div className="flex flex-col space-y-10">
            <div>
              <h2 className="text-2xl font-playfair mb-6">Pour me contacter</h2>
              <p className="text-muted-foreground mb-8">
                N&apos;hésitez pas à me contacter pour toute information
                concernant mes œuvres, les expositions en cours ou à venir, ou
                pour discuter d&apos;un projet de collaboration.
              </p>

              <Separator className="my-8" />

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="w-5 h-5 text-muted-foreground mt-1" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-muted-foreground mt-1">
                      christian.margot@icloud.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Instagram className="w-5 h-5 text-muted-foreground mt-1" />
                  <div>
                    <h3 className="font-medium">Instagram</h3>
                    <a
                      href="https://www.instagram.com/artsc_margot/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground mt-1 hover:text-primary transition-colors"
                    >
                      @artsc_margot
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
