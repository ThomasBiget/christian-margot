"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Artwork } from "../../types";
import { motion } from "framer-motion";

interface RelatedArtworksProps {
  artworks: Artwork[];
}

export default function RelatedArtworks({ artworks }: RelatedArtworksProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
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
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div
                className={`absolute inset-0 bg-black/50 flex items-end p-4 transition-opacity duration-300 ${
                  hoveredId === artwork.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <h3 className="text-white text-lg font-medium font-playfair">
                  {artwork.title}
                </h3>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
