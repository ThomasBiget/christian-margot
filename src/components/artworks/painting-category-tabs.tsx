"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryGrid } from "../../components/artworks/category-grid";
import { Artwork } from "../../types";

interface PaintingCategoryTabsProps {
  paintings: Artwork[];
}

export function PaintingCategoryTabs({ paintings }: PaintingCategoryTabsProps) {
  const [subcategory, setSubcategory] = useState<string>("all");

  const oilPaintings = paintings.filter(
    (painting) => painting.subcategory?.toLowerCase() === "huile"
  );

  const watercolorPaintings = paintings.filter(
    (painting) => painting.subcategory?.toLowerCase() === "aquarelle"
  );

  const acrylicPaintings = paintings.filter(
    (painting) => painting.subcategory?.toLowerCase() === "acrylique"
  );

  const waxPaintings = paintings.filter(
    (painting) => painting.subcategory?.toLowerCase() === "cire"
  );

  return (
    <Tabs defaultValue="all" onValueChange={setSubcategory}>
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
        <TabsTrigger value="all">Toutes</TabsTrigger>
        <TabsTrigger value="huile">Huile</TabsTrigger>
        <TabsTrigger value="aquarelle">Aquarelle</TabsTrigger>
        <TabsTrigger value="acrylique">Acrylique</TabsTrigger>
        <TabsTrigger value="cire">Cire</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-6">
        <CategoryGrid artworks={paintings} />
      </TabsContent>

      <TabsContent value="huile" className="mt-6">
        <CategoryGrid artworks={oilPaintings} />
      </TabsContent>

      <TabsContent value="aquarelle" className="mt-6">
        <CategoryGrid artworks={watercolorPaintings} />
      </TabsContent>

      <TabsContent value="acrylique" className="mt-6">
        <CategoryGrid artworks={acrylicPaintings} />
      </TabsContent>

      <TabsContent value="cire" className="mt-6">
        <CategoryGrid artworks={waxPaintings} />
      </TabsContent>
    </Tabs>
  );
}
