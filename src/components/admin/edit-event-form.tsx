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
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";
import { MultipleImageUpload } from "@/components/ui/multiple-image-upload";

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
    startDate: format(new Date(event.startDate), "yyyy-MM-dd"),
    startTime: format(new Date(event.startDate), "HH:mm"),
    endDate: format(new Date(event.endDate), "yyyy-MM-dd"),
    endTime: format(new Date(event.endDate), "HH:mm"),
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

  const validateDates = () => {
    const startDateTime = new Date(
      `${formData.startDate}T${formData.startTime}`
    );
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

    if (startDateTime >= endDateTime) {
      toast.error("La date de fin doit être postérieure à la date de début");
      return false;
    }

    return true;
  };

  const removeExistingImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/events/images/${imageId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
        toast.success("Image supprimée avec succès");
      } else {
        throw new Error(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression de l'image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateDates()) {
      return;
    }

    setIsLoading(true);

    try {
      const startDateTime = new Date(
        `${formData.startDate}T${formData.startTime}`
      );
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      const eventData = {
        title: formData.title,
        description: formData.description,
        mainImageUrl: mainImage,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
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

      if (response.status === 401) {
        toast.error("Session expirée. Veuillez vous reconnecter.");
        const callbackUrl = encodeURIComponent(`/admin/evenements/${event.id}`);
        router.push(`/admin/login?callbackUrl=${callbackUrl}`);
        return;
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Événement mis à jour avec succès");
        router.push("/admin/evenements");
        router.refresh();
      } else {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la mise à jour de l'événement");
    } finally {
      setIsLoading(false);
    }
  };

  const maxNewImages = Math.max(0, 10 - existingImages.length);

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

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Date et heure de début *</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Date de début *</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="startTime">Heure de début *</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Date et heure de fin *</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="endDate">Date de fin *</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endTime">Heure de fin *</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
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
          <ImageUpload
            value={mainImage}
            onChange={setMainImage}
            label="Image principale de l'événement"
            required
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Images supplémentaires ({existingImages.length + newImages.length}
            /10)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Images existantes */}
            {existingImages.length > 0 && (
              <div>
                <h4 className="font-medium mb-4">Images actuelles</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {existingImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="relative aspect-square rounded-lg overflow-hidden border">
                        <Image
                          src={image.imageUrl}
                          alt="Image événement"
                          fill
                          className="object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeExistingImage(image.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Composant pour ajouter de nouvelles images */}
            {maxNewImages > 0 && (
              <div>
                <h4 className="font-medium mb-4">
                  Ajouter de nouvelles images
                </h4>
                <MultipleImageUpload
                  values={newImages}
                  onChange={setNewImages}
                  label=""
                  maxImages={maxNewImages}
                />
              </div>
            )}

            {existingImages.length === 0 && newImages.length === 0 && (
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