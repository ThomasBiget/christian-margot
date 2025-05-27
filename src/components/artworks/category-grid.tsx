"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Artwork } from "../../types";

interface CategoryGridProps {
  artworks: Artwork[];
}

export function CategoryGrid({ artworks }: CategoryGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (artworks.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">
          Aucune œuvre disponible dans cette catégorie pour le moment.
        </p>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {artworks.map((artwork) => (
        <motion.div
          key={artwork.id}
          variants={item}
          onMouseEnter={() => setHoveredId(artwork.id)}
          onMouseLeave={() => setHoveredId(null)}
          className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
        >
          <Link href={`/oeuvres/${artwork.id}`} className="block">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div
                className={`absolute inset-0 bg-black/50 flex items-end p-4 transition-opacity duration-300 ${
                  hoveredId === artwork.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="text-white">
                  <h3 className="text-lg font-medium font-playfair">
                    {artwork.title}
                  </h3>
                  {artwork.subcategory && (
                    <p className="text-sm opacity-80 capitalize mt-1">
                      {artwork.subcategory}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
