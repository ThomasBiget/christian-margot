import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import sharp from "sharp";

/**
 * Alternative d'upload LOCAL pour le développement
 * Les images sont stockées dans /public/uploads
 * 
 * ⚠️ ATTENTION : N'utilisez PAS cette route en production !
 * En production, utilisez /api/upload avec Vercel Blob
 */
export async function POST(request: NextRequest) {
  // Vérifier qu'on est bien en développement
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Cette route n'est disponible qu'en développement. Utilisez /api/upload" },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier (inclure HEIC/HEIF)
    const isImage = file.type.startsWith("image/") || 
                    file.type === "image/heic" || 
                    file.type === "image/heif" ||
                    /\.heic$/i.test(file.name) ||
                    /\.heif$/i.test(file.name);
    
    if (!isImage) {
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

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
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
      uploadBuffer = await sharp(Buffer.from(arrayBuffer))
        .jpeg({ quality: 90 })
        .toBuffer();
      targetExtension = "jpg";
    } else {
      uploadBuffer = Buffer.from(arrayBuffer);
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

    // Enregistrer le fichier
    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, uploadBuffer);

    // Retourner l'URL relative (accessible via /uploads/filename)
    const url = `/uploads/${filename}`;
    
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Erreur upload local:", error);
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
