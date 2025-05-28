import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updateEvent, deleteEvent, addEventImages } from "@/lib/event";
import { revalidatePath } from "next/cache";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { newImages, ...eventData } = body;

    // Mettre à jour l'événement
    const event = await updateEvent(params.id, eventData);

    // Ajouter les nouvelles images si présentes
    if (newImages && newImages.length > 0) {
      await addEventImages(params.id, newImages);
    }

    // Revalider les pages qui affichent les événements
    revalidatePath("/"); // Page d'accueil
    revalidatePath("/evenements"); // Page des événements
    revalidatePath(`/evenements/${params.id}`); // Page individuelle de l'événement
    revalidatePath("/admin"); // Page admin
    revalidatePath("/admin/evenements"); // Page admin événements

    return NextResponse.json({
      success: true,
      event,
      message: "Événement mis à jour avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'événement:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la mise à jour de l'événement",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await deleteEvent(params.id);

    // Revalider les pages qui affichent les événements
    revalidatePath("/"); // Page d'accueil
    revalidatePath("/evenements"); // Page des événements
    revalidatePath(`/evenements/${params.id}`); // Page individuelle de l'événement
    revalidatePath("/admin"); // Page admin
    revalidatePath("/admin/evenements"); // Page admin événements

    return NextResponse.json({
      success: true,
      message: "Événement supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'événement:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la suppression de l'événement",
      },
      { status: 500 }
    );
  }
}
