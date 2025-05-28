import Image from "next/image";
import FeaturedWorks from "../components/home/featured-works";
import { getFeaturedArtworks } from "../lib/artwork";
import HeaderImage from "../media/cm-banner.png";

export default async function Home() {
  const featuredArtworks = await getFeaturedArtworks();

  return (
    <>
      <section className="relative h-[70vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={HeaderImage}
            alt="Atelier d'artiste"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <blockquote className="text-white text-2xl md:text-3xl lg:text-4xl font-light italic font-playfair">
            &quot;Mon art est une quête perpétuelle de sens et d&apos;émotion,
            une invitation à voir le monde à travers mes yeux de daltonien&quot;
          </blockquote>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-playfair mb-12 text-center">
            Œuvres en Vedette
          </h2>
          <FeaturedWorks artworks={featuredArtworks} />
        </div>
      </section>
    </>
  );
}
