"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, Plus } from "lucide-react";
import Image from "next/image";

interface MultipleImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  maxImages?: number;
  className?: string;
}

export function MultipleImageUpload({
  values,
  onChange,
  label = "Images",
  maxImages = 10,
  className = "",
}: MultipleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;

    const remainingSlots = maxImages - values.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    if (filesToUpload.length === 0) {
      alert(`Vous ne pouvez ajouter que ${maxImages} images maximum`);
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        // Vérifier le type de fichier (inclure HEIC/HEIF)
        const isImage = file.type.startsWith("image/") || 
                        file.type === "image/heic" || 
                        file.type === "image/heif" ||
                        /\.heic$/i.test(file.name) ||
                        /\.heif$/i.test(file.name);
        
        if (!isImage) {
          throw new Error(`${file.name} n'est pas une image valide`);
        }

        // Vérifier la taille (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`${file.name} dépasse la taille limite de 10MB`);
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Erreur lors de l'upload de ${file.name}`);
        }

        const { url } = await response.json();
        return url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onChange([...values, ...uploadedUrls]);
    } catch (error) {
      console.error("Erreur upload:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de l'upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(files);
    }
  };

  const handleManualUrlAdd = () => {
    if (manualUrl.trim() && values.length < maxImages) {
      onChange([...values, manualUrl.trim()]);
      setManualUrl("");
      setShowManualInput(false);
    }
  };

  const handleRemove = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  const canAddMore = values.length < maxImages;

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-sm font-medium">
        {label} ({values.length}/{maxImages})
      </Label>

      {/* Images existantes */}
      {values.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {values.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square rounded-lg overflow-hidden border">
                <Image
                  src={url}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemove(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Zone d'ajout */}
      {canAddMore && (
        <div className="space-y-4">
          {!showManualInput ? (
            <div className="space-y-2">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Upload en cours...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter des images
                      </>
                    )}
                  </Button>
                  <p className="mt-2 text-sm text-gray-500">
                    PNG, JPG, WEBP et HEIC (converti) jusqu&apos;à 10MB chacune
                  </p>
                  <p className="text-xs text-gray-400">
                    Vous pouvez sélectionner plusieurs fichiers
                  </p>
                </div>
              </div>
              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowManualInput(true)}
                >
                  Ou entrer une URL manuellement
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="https://exemple.com/image.jpg"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={handleManualUrlAdd}
                  disabled={!manualUrl.trim()}
                >
                  Ajouter
                </Button>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowManualInput(false)}
              >
                Retour à l&apos;upload
              </Button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
