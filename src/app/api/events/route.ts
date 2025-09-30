// app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAllEvents, createEvent, addEventImages } from "@/lib/event";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Force Node.js runtime (nécessaire pour Prisma)
export const runtime = "nodejs";

const createEventSchema = z
  .object({
    title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
    description: z
      .string()
      .min(10, "La description doit contenir au moins 10 caractères"),
    mainImageUrl: z.string().url("Veuillez entrer une URL valide pour l'image"),
    startDate: z.string().datetime("Date de début invalide"),
    endDate: z.string().datetime("Date de fin invalide"),
    location: z.string().optional(),
    featured: z.boolean().default(false),
    additionalImages: z.array(z.string().url()).optional(),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return startDate <= endDate;
    },
    {
      message:
        "La date de fin doit être postérieure ou égale à la date de début",
      path: ["endDate"],
    }
  );

export async function GET() {
  try {
    const events = await getAllEvents();

    return NextResponse.json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des événements",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();

    // Validation des données
    const validatedData = createEventSchema.parse(body);

    // Création de l'événement en base de données
    const event = await createEvent({
      title: validatedData.title,
      description: validatedData.description,
      mainImageUrl: validatedData.mainImageUrl,
      startDate: new Date(validatedData.startDate),
      endDate: new Date(validatedData.endDate),
      location: validatedData.location,
      featured: validatedData.featured || false,
    });

    // Ajouter les images supplémentaires si présentes
    if (
      validatedData.additionalImages &&
      validatedData.additionalImages.length > 0
    ) {
      await addEventImages(event.id, validatedData.additionalImages);
    }

    // Revalider les pages qui affichent les événements
    revalidatePath("/"); // Page d'accueil
    revalidatePath("/evenements"); // Page des événements
    revalidatePath("/admin"); // Page admin
    revalidatePath("/admin/evenements"); // Page admin événements

    return NextResponse.json(
      {
        success: true,
        event,
        message: "Événement créé avec succès",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création de l'événement:", error);

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
        error: "Erreur lors de la création de l'événement",
      },
      { status: 500 }
    );
  }
}
