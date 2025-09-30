import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Force Node.js runtime (nécessaire pour Prisma)
export const runtime = "nodejs";

const createArtworkSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  imageUrl: z.string().url("Veuillez entrer une URL valide pour l'image"),
  category: z.enum(["peinture", "collage", "stylo", "modelage", "copie"]),
  subcategory: z.string().optional(),
  featured: z.boolean().default(false),
  displayPriority: z.number().min(0).max(10).optional(),
});

const updateArtworkSchema = z.object({
  id: z.string(),
  featured: z.boolean().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  category: z
    .enum(["peinture", "collage", "stylo", "modelage", "copie"])
    .optional(),
  subcategory: z.string().optional(),
  displayPriority: z.number().min(0).max(10).optional(),
});

export async function GET() {
  try {
    const artworks = await prisma.artwork.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Tri applicatif: priorité desc puis date desc (fallback si la colonne n'existe pas en BDD)
    const sorted = artworks.sort((a: any, b: any) => {
      const pa = (a as any).displayPriority ?? 0;
      const pb = (b as any).displayPriority ?? 0;
      if (pb !== pa) return pb - pa;
      return (
        new Date(b.createdAt as any).getTime() -
        new Date(a.createdAt as any).getTime()
      );
    });

    return NextResponse.json({
      success: true,
      artworks: sorted,
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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 401 }
      );
    }
    const body = await request.json();

    // Validation des données
    const validatedData = createArtworkSchema.parse(body);

    // Création de l'artwork en base de données
    const data: any = {
      title: validatedData.title,
      description: validatedData.description,
      imageUrl: validatedData.imageUrl,
      category: validatedData.category,
      subcategory: validatedData.subcategory || "",
      featured: validatedData.featured || false,
    };
    if (validatedData.displayPriority !== undefined) {
      data.displayPriority = validatedData.displayPriority;
    }
    const artwork = await prisma.artwork.create({ data });

    // Revalider les pages qui affichent les œuvres
    revalidatePath("/"); // Page d'accueil
    revalidatePath("/oeuvres"); // Page des œuvres
    revalidatePath("/admin"); // Page admin

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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 401 }
      );
    }
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
        ...(validatedData.displayPriority !== undefined && {
          displayPriority: validatedData.displayPriority,
        }),
      },
    });

    // Revalider les pages qui affichent les œuvres
    revalidatePath("/"); // Page d'accueil
    revalidatePath("/oeuvres"); // Page des œuvres
    revalidatePath("/admin"); // Page admin

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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 401 }
      );
    }
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
