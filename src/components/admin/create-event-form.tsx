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
    date: "",
    time: "",
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

  const addAdditionalImage = () => {
    if (additionalImages.length < 10) {
      setAdditionalImages((prev) => [...prev, ""]);
    }
  };

  const updateAdditionalImage = (index: number, url: string) => {
    setAdditionalImages((prev) =>
      prev.map((img, i) => (i === index ? url : img))
    );
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Combiner date et heure
      const dateTime = new Date(`${formData.date}T${formData.time}`);

      const eventData = {
        title: formData.title,
        description: formData.description,
        mainImageUrl: mainImage,
        date: dateTime.toISOString(),
        location: formData.location || null,
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

      if (response.ok) {
        onSuccess?.();
        router.push("/admin/evenements");
      } else {
        console.error("Erreur lors de la création");
      }
    } catch (error) {
      console.error("Erreur:", error);
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
            Images supplémentaires ({additionalImages.length}/10)
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAdditionalImage}
              disabled={additionalImages.length >= 10}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {additionalImages.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Aucune image supplémentaire ajoutée.
            </p>
          ) : (
            <div className="space-y-4">
              {additionalImages.map((imageUrl, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-1">
                    <Label htmlFor={`image-${index}`}>Image {index + 1}</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`image-${index}`}
                        value={imageUrl}
                        onChange={(e) =>
                          updateAdditionalImage(index, e.target.value)
                        }
                        placeholder="https://example.com/image.jpg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAdditionalImage(index)}
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
          )}
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
