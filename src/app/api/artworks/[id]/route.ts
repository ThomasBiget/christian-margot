import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Supprimer l'œuvre de la base de données
    await prisma.artwork.delete({
      where: { id },
    });

    // Revalider les pages qui affichent les œuvres
    revalidatePath("/"); // Page d'accueil
    revalidatePath("/oeuvres"); // Page des œuvres
    revalidatePath("/admin"); // Page admin

    return NextResponse.json({
      success: true,
      message: "Œuvre supprimée avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'œuvre:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la suppression de l'œuvre",
      },
      { status: 500 }
    );
  }
}
