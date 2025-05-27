import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getArtworkById, getRelatedArtworks } from "../../../lib/artwork";
import { Separator } from "@/components/ui/separator";
import RelatedArtworks from "../../../components/artworks/related-artworks";

interface ArtworkPageParams {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: ArtworkPageParams): Promise<Metadata> {
  const artwork = await getArtworkById(params.id);

  if (!artwork) {
    return {
      title: "Œuvre non trouvée | Portfolio Artistique",
    };
  }

  return {
    title: `${artwork.title} | Portfolio Artistique`,
    description: artwork.description,
  };
}

export default async function ArtworkPage({ params }: ArtworkPageParams) {
  const artwork = await getArtworkById(params.id);

  if (!artwork) {
    notFound();
  }

  const relatedArtworks = await getRelatedArtworks(
    artwork.category,
    artwork.id
  );

  return (
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative aspect-square rounded-lg overflow-hidden shadow-md">
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-playfair mb-4">
              {artwork.title}
            </h1>

            <div className="flex items-center mb-6 text-sm text-muted-foreground">
              <span className="capitalize">{artwork.category}</span>
              {artwork.subcategory && (
                <>
                  <span className="mx-2">•</span>
                  <span className="capitalize">{artwork.subcategory}</span>
                </>
              )}
            </div>

            <Separator className="my-6" />

            <div className="prose prose-sm max-w-none">
              <p className="text-foreground whitespace-pre-line">
                {artwork.description}
              </p>
            </div>
          </div>
        </div>

        {relatedArtworks.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-playfair mb-8">Œuvres similaires</h2>
            <RelatedArtworks artworks={relatedArtworks} />
          </div>
        )}
      </div>
    </div>
  );
}
