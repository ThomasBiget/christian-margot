// components/admin/edit-event-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EventWithImages } from "@/lib/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

interface EditEventFormProps {
  event: EventWithImages;
}

export function EditEventForm({ event }: EditEventFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [mainImage, setMainImage] = useState(event.mainImageUrl);
  const [existingImages, setExistingImages] = useState(event.images);
  const [newImages, setNewImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description,
    date: format(new Date(event.date), "yyyy-MM-dd"),
    time: format(new Date(event.date), "HH:mm"),
    location: event.location || "",
    featured: event.featured,
  });

  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      featured: checked,
    }));
  };

  const addNewImage = () => {
    const totalImages = existingImages.length + newImages.length;
    if (totalImages < 10) {
      setNewImages((prev) => [...prev, ""]);
    }
  };

  const updateNewImage = (index: number, url: string) => {
    setNewImages((prev) => prev.map((img, i) => (i === index ? url : img)));
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/events/images/${imageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`);

      const eventData = {
        title: formData.title,
        description: formData.description,
        mainImageUrl: mainImage,
        date: dateTime.toISOString(),
        location: formData.location || null,
        featured: formData.featured,
      };

      const response = await fetch(`/api/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...eventData,
          newImages: newImages.filter((img) => img.trim() !== ""),
        }),
      });

      if (response.ok) {
        router.push("/admin/evenements");
      } else {
        console.error("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalImages = existingImages.length + newImages.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Titre de l'événement"
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Description de l'événement"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Heure *</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Lieu</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Lieu de l'événement"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="featured">Événement à la une</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Image principale *</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="mainImage">URL de l&apos;image principale</Label>
            <Input
              id="mainImage"
              value={mainImage}
              onChange={(e) => setMainImage(e.target.value)}
              required
              placeholder="https://example.com/image.jpg"
            />
            {mainImage && (
              <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden">
                <Image
                  src={mainImage}
                  alt="Aperçu"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Images supplémentaires ({totalImages}/10)
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addNewImage}
              disabled={totalImages >= 10}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Images existantes */}
            {existingImages.length > 0 && (
              <div>
                <h4 className="font-medium mb-4">Images actuelles</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {existingImages.map((image) => (
                    <div key={image.id} className="relative">
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={image.imageUrl}
                          alt="Image événement"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeExistingImage(image.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nouvelles images */}
            {newImages.length > 0 && (
              <div>
                <h4 className="font-medium mb-4">Nouvelles images</h4>
                <div className="space-y-4">
                  {newImages.map((imageUrl, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-1">
                        <Label htmlFor={`new-image-${index}`}>
                          Nouvelle image {index + 1}
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id={`new-image-${index}`}
                            value={imageUrl}
                            onChange={(e) =>
                              updateNewImage(index, e.target.value)
                            }
                            placeholder="https://example.com/image.jpg"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeNewImage(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        {imageUrl && (
                          <div className="mt-2 relative w-32 h-24 rounded overflow-hidden">
                            <Image
                              src={imageUrl}
                              alt={`Aperçu ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {totalImages === 0 && (
              <p className="text-muted-foreground text-sm">
                Aucune image supplémentaire.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Mise à jour en cours..." : "Mettre à jour l'événement"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
