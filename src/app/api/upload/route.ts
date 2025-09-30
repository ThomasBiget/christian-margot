import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

// Force Node.js runtime (nécessaire pour Vercel Blob et Sharp)
export const runtime = "nodejs";
export const maxDuration = 10; // 10 secondes (limite Hobby plan Vercel)

export async function POST(request: NextRequest) {
  try {
    // Vérifier que la variable d'environnement est configurée
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error(
        "BLOB_READ_WRITE_TOKEN n'est pas configuré dans les variables d'environnement"
      );
      return NextResponse.json(
        {
          error:
            "Configuration du stockage d'images manquante. Veuillez contacter l'administrateur.",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Le fichier doit être une image" },
        { status: 400 }
      );
    }

    // Vérifier la taille (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "L'image ne doit pas dépasser 10MB" },
        { status: 400 }
      );
    }

    // Gérer HEIC/HEIF -> convertir en JPEG
    const isHeic =
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      /\.heic$/i.test(file.name) ||
      /\.heif$/i.test(file.name);

    const arrayBuffer = await file.arrayBuffer();
    let uploadBuffer: Buffer;
    let targetExtension = "jpg";

    if (isHeic) {
      // Convertit en JPEG de bonne qualité pour compatibilité navigateur
      // Optimisation : limiter la taille pour accélérer le traitement
      uploadBuffer = await sharp(Buffer.from(arrayBuffer))
        .resize(2048, 2048, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85, mozjpeg: true })
        .toBuffer();
      targetExtension = "jpg";
    } else {
      // Optimiser toutes les images pour réduire le temps de traitement
      const sharpInstance = sharp(Buffer.from(arrayBuffer));
      const metadata = await sharpInstance.metadata();
      
      // Si l'image est trop grande, la redimensionner
      if (metadata.width && metadata.width > 2048) {
        uploadBuffer = await sharpInstance
          .resize(2048, 2048, { fit: 'inside', withoutEnlargement: true })
          .toBuffer();
      } else {
        uploadBuffer = Buffer.from(arrayBuffer);
      }
      
      // Conserver extension connue si image
      const extFromName = (file.name.split(".").pop() || "jpg").toLowerCase();
      targetExtension = ["jpg", "jpeg", "png", "webp", "gif", "avif"].includes(
        extFromName
      )
        ? extFromName
        : "jpg";
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const filename = `artwork-${timestamp}-${randomString}.${targetExtension}`;

    // Upload vers Vercel Blob
    const blob = await put(filename, uploadBuffer, {
      access: "public",
      addRandomSuffix: false,
      contentType:
        targetExtension === "jpg" || targetExtension === "jpeg"
          ? "image/jpeg"
          : `image/${targetExtension}`,
    });

    console.log(`✅ Image uploadée sur Vercel Blob : ${blob.url}`);

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Erreur upload:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'upload de l'image",
      },
      { status: 500 }
    );
  }
}
