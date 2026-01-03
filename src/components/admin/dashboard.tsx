"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import ArtworksList from "@/components/admin/artworks-list";
import NewArtworkForm from "@/components/admin/new-artwork-form";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("artworks");

  return (
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center mb-8">
          <h1 className="text-3xl font-playfair text-slate-900">Gestion des œuvres</h1>
        </div>

        <Separator className="my-6" />

        <Tabs
          defaultValue="artworks"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="artworks">Gérer les œuvres</TabsTrigger>
            <TabsTrigger value="new">Ajouter une œuvre</TabsTrigger>
          </TabsList>

          <TabsContent value="artworks">
            <ArtworksList />
          </TabsContent>

          <TabsContent value="new">
            <NewArtworkForm onSuccess={() => setActiveTab("artworks")} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
