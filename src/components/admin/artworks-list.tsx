"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Edit,
  Star,
  Trash2,
  ExternalLink,
  StarOff,
  Search,
} from "lucide-react";
import { Artwork } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function ArtworksList() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch("/api/artworks");
        const data = await response.json();

        if (data.success) {
          setArtworks(
            data.artworks.map((a: any) => ({
              ...a,
              subcategory: a.subcategory ?? undefined,
            }))
          );
        } else {
          throw new Error(data.error || "Erreur lors du chargement");
        }
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Erreur lors du chargement des œuvres");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const filteredArtworks = artworks.filter(
    (artwork) =>
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (artwork.subcategory &&
        artwork.subcategory.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  console.log(filteredArtworks);

  const handleToggleFeatured = async (artwork: Artwork) => {
    try {
      const response = await fetch("/api/artworks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: artwork.id,
          featured: !artwork.featured,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const updatedArtworks = artworks.map((item) =>
          item.id === artwork.id ? { ...item, featured: !item.featured } : item
        );
        setArtworks(updatedArtworks);

        toast.success(
          `Œuvre ${
            artwork.featured ? "retirée des" : "ajoutée aux"
          } œuvres en vedette`
        );
      } else {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la mise à jour de l'œuvre");
    }
  };

  const handleDeleteArtwork = async (id: string) => {
    try {
      setDeletingId(id);

      const response = await fetch(`/api/artworks/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        const updatedArtworks = artworks.filter((artwork) => artwork.id !== id);
        setArtworks(updatedArtworks);
        toast.success("Œuvre supprimée avec succès");
      } else {
        console.log(data.error);
        throw new Error(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la suppression de l'œuvre");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center relative">
        <Search className="absolute left-3 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Rechercher une œuvre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Sous-catégorie</TableHead>
              <TableHead>Date d&apos;ajout</TableHead>
              <TableHead className="w-[100px]">En vedette</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArtworks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Aucune œuvre trouvée.
                </TableCell>
              </TableRow>
            ) : (
              filteredArtworks.map((artwork) => (
                <TableRow key={artwork.id}>
                  <TableCell>
                    <div className="relative h-16 w-16 rounded overflow-hidden">
                      <Image
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{artwork.title}</TableCell>
                  <TableCell className="capitalize">
                    {artwork.category}
                  </TableCell>
                  <TableCell className="capitalize">
                    {artwork.subcategory || "-"}
                  </TableCell>
                  <TableCell>{formatDate(artwork.createdAt)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleFeatured(artwork)}
                    >
                      {artwork.featured ? (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <StarOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/oeuvres/${artwork.id}`} target="_blank">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/edit/${artwork.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={deletingId === artwork.id}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Supprimer cette œuvre ?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action ne peut pas être annulée.
                              L&apos;œuvre sera définitivement supprimée.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteArtwork(artwork.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
