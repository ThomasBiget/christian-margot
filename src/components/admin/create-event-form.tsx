// components/admin/create-event-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Plus } from "lucide-react";
import Image from "next/image";
import { ImageUpload } from "@/components/ui/image-upload";
import { MultipleImageUpload } from "@/components/ui/multiple-image-upload";
import { toast } from "sonner";

interface CreateEventFormProps {
  onSuccess?: () => void;
}

export function CreateEventForm({ onSuccess }: CreateEventFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    featured: false,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mainImage) {
      toast.error("Veuillez sélectionner une image principale");
      return;
    }

    if (!validateDates()) {
      return;
    }

    setIsLoading(true);

    try {
      // Combiner dates et heures
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
        location: formData.location || undefined,
        featured: formData.featured,
      };

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...eventData,
          additionalImages: additionalImages.filter((img) => img.trim() !== ""),
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Événement créé avec succès");
        onSuccess?.();
        router.push("/admin/evenements");
      } else {
        throw new Error(data.error || "Erreur lors de la création");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la création de l'événement");
    } finally {
      setIsLoading(false);
    }
  };

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
          <CardTitle>Images supplémentaires</CardTitle>
        </CardHeader>
        <CardContent>
          <MultipleImageUpload
            values={additionalImages}
            onChange={setAdditionalImages}
            label="Images supplémentaires"
            maxImages={10}
          />
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Création en cours..." : "Créer l'événement"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
