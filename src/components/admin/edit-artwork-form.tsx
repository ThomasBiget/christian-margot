"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Artwork } from "@/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";

interface EditArtworkFormProps {
  artwork: Artwork;
}

const formSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  imageUrl: z.string().url("Veuillez entrer une URL valide pour l&apos;image"),
  category: z.enum(["peinture", "collage", "stylo", "modelage", "copie"]),
  subcategory: z.string().optional(),
  featured: z.boolean().default(false),
  displayPriority: z
    .number({ invalid_type_error: "Veuillez entrer un nombre entre 1 et 10" })
    .int()
    .min(1, "Minimum 1")
    .max(10, "Maximum 10")
    .optional(),
});

export default function EditArtworkForm({ artwork }: EditArtworkFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: artwork.title,
      description: artwork.description,
      imageUrl: artwork.imageUrl,
      category: artwork.category as
        | "peinture"
        | "collage"
        | "stylo"
        | "modelage"
        | "copie",
      subcategory: artwork.subcategory || "",
      featured: artwork.featured || false,
      displayPriority: (artwork as any).displayPriority ?? undefined,
    },
  });

  const watchCategory = form.watch("category");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/artworks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: artwork.id,
          title: values.title,
          description: values.description,
          imageUrl: values.imageUrl,
          category: values.category,
          subcategory: values.subcategory || "",
          featured: values.featured,
          displayPriority: values.displayPriority,
        }),
      });

      if (response.status === 401) {
        toast.error("Session expirée. Veuillez vous reconnecter.");
        const callbackUrl = encodeURIComponent(`/admin/edit/${artwork.id}`);
        router.push(`/admin/login?callbackUrl=${callbackUrl}`);
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      toast.success("Œuvre mise à jour avec succès");
      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la mise à jour de l&apos;œuvre");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input placeholder="Titre de l'œuvre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description de l'œuvre"
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    label="Image de l'œuvre"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="peinture">Peinture</SelectItem>
                      <SelectItem value="collage">Collage</SelectItem>
                      <SelectItem value="stylo">Stylo</SelectItem>
                      <SelectItem value="modelage">Modelage</SelectItem>
                      <SelectItem value="copie">Copie</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchCategory === "peinture" && (
              <FormField
                control={form.control}
                name="subcategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sous-catégorie</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une sous-catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="huile">Huile</SelectItem>
                        <SelectItem value="aquarelle">Aquarelle</SelectItem>
                        <SelectItem value="acrylique">Acrylique</SelectItem>
                        <SelectItem value="cire">Cire</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />

                  <FormField
                    control={form.control}
                    name="displayPriority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Priorité d&apos;affichage (optionnel)
                        </FormLabel>
                        <FormDescription>
                          1 à 10. Plus la valeur est élevée, plus l&apos;œuvre
                          est mise en avant.
                        </FormDescription>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={10}
                            placeholder="Ex: 8"
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value)
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Mettre en vedette</FormLabel>
                  <FormDescription>
                    Cette œuvre sera affichée sur la page d&apos;accueil
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin")}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Mise à jour en cours..." : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
