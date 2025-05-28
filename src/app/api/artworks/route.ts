import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createArtworkSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  imageUrl: z.string().url("Veuillez entrer une URL valide pour l'image"),
  category: z.enum(["peinture", "collage", "stylo", "modelage"]),
  subcategory: z.string().optional(),
  featured: z.boolean().default(false),
});

const updateArtworkSchema = z.object({
  id: z.string(),
  featured: z.boolean().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  category: z.enum(["peinture", "collage", "stylo", "modelage"]).optional(),
  subcategory: z.string().optional(),
});

export async function GET() {
  try {
    const artworks = await prisma.artwork.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      artworks,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des œuvres:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des œuvres",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation des données
    const validatedData = createArtworkSchema.parse(body);

    // Création de l'artwork en base de données
    const artwork = await prisma.artwork.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        imageUrl: validatedData.imageUrl,
        category: validatedData.category,
        subcategory: validatedData.subcategory || "",
        featured: validatedData.featured || false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        artwork,
        message: "Œuvre ajoutée avec succès",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création de l'artwork:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Données invalides",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de l'ajout de l'œuvre",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = updateArtworkSchema.parse(body);

    const artwork = await prisma.artwork.update({
      where: { id: validatedData.id },
      data: {
        ...(validatedData.featured !== undefined && {
          featured: validatedData.featured,
        }),
        ...(validatedData.title && { title: validatedData.title }),
        ...(validatedData.description && {
          description: validatedData.description,
        }),
        ...(validatedData.imageUrl && { imageUrl: validatedData.imageUrl }),
        ...(validatedData.category && { category: validatedData.category }),
        ...(validatedData.subcategory !== undefined && {
          subcategory: validatedData.subcategory,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      artwork,
      message: "Œuvre mise à jour avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'artwork:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Données invalides",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la mise à jour de l'œuvre",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "ID de l'œuvre requis",
        },
        { status: 400 }
      );
    }

    await prisma.artwork.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Œuvre supprimée avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'artwork:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la suppression de l'œuvre",
      },
      { status: 500 }
    );
  }
}
