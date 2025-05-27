import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getArtworksByCategory } from "@/lib/artwork";
import { CategoryGrid } from "@/components/artworks/category-grid";
import { PaintingCategoryTabs } from "@/components/artworks/painting-category-tabs";

export const metadata = {
  title: "Mes Œuvres | Portfolio Artistique",
  description:
    "Découvrez la collection complète de mes créations artistiques: peintures, collages, œuvres au stylo et modelages.",
};

export default async function ArtworksPage() {
  const paintings = await getArtworksByCategory("peinture");
  const collages = await getArtworksByCategory("collage");
  const pens = await getArtworksByCategory("stylo");
  const sculptures = await getArtworksByCategory("modelage");

  return (
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-playfair mb-8 text-center">
          Mes Œuvres
        </h1>

        <Tabs defaultValue="peinture" className="w-full mt-12">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto">
            <TabsTrigger value="peinture" className="py-3">
              Peinture
            </TabsTrigger>
            <TabsTrigger value="collage" className="py-3">
              Collage
            </TabsTrigger>
            <TabsTrigger value="stylo" className="py-3">
              Stylo
            </TabsTrigger>
            <TabsTrigger value="modelage" className="py-3">
              Modelage
            </TabsTrigger>
          </TabsList>

          <TabsContent value="peinture" className="mt-8">
            <PaintingCategoryTabs paintings={paintings} />
          </TabsContent>

          <TabsContent value="collage" className="mt-8">
            <CategoryGrid artworks={collages} />
          </TabsContent>

          <TabsContent value="stylo" className="mt-8">
            <CategoryGrid artworks={pens} />
          </TabsContent>

          <TabsContent value="modelage" className="mt-8">
            <CategoryGrid artworks={sculptures} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
