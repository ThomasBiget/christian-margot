import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = params;

    // Récupérer l'événement associé à l'image pour pouvoir invalider sa page
    const eventImage = await prisma.eventImage.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!eventImage) {
      return NextResponse.json(
        { success: false, error: "Image non trouvée" },
        { status: 404 }
      );
    }

    // Supprimer l'image de la base de données
    await prisma.eventImage.delete({
      where: { id },
    });

    // Revalider les pages qui affichent les événements
    revalidatePath("/"); // Page d'accueil
    revalidatePath("/evenements"); // Page des événements
    revalidatePath(`/evenements/${eventImage.event.id}`); // Page individuelle de l'événement
    revalidatePath("/admin"); // Page admin
    revalidatePath("/admin/evenements"); // Page admin événements

    return NextResponse.json({
      success: true,
      message: "Image supprimée avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la suppression de l'image",
      },
      { status: 500 }
    );
  }
}
