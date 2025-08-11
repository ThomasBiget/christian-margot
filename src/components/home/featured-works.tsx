"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Artwork } from "../../types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeaturedWorksProps {
  artworks: Artwork[];
}

export default function FeaturedWorks({ artworks }: FeaturedWorksProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // If no client-side hydration yet, render empty divs as placeholders
  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] bg-muted animate-pulse rounded-lg"
          ></div>
        ))}
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const sorted = [...artworks].sort((a: any, b: any) => {
    const pa = (a as any).displayPriority ?? 0;
    const pb = (b as any).displayPriority ?? 0;
    if (pb !== pa) return pb - pa;
    return (
      new Date(b.createdAt as any).getTime() -
      new Date(a.createdAt as any).getTime()
    );
  });

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {sorted.map((artwork, index) => (
        <motion.div
          key={artwork.id}
          variants={item}
          className={cn(
            "group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow",
            index === 0 && "md:col-span-2 lg:col-span-2"
          )}
        >
          <Link href={`/oeuvres/${artwork.id}`} className="block">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-playfair mb-2">{artwork.title}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="capitalize">{artwork.category}</span>
                {artwork.subcategory && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="capitalize">{artwork.subcategory}</span>
                  </>
                )}
              </div>
              <div className="mt-4 flex items-center text-sm font-medium text-accent-foreground">
                Voir l&apos;œuvre
                <ArrowRight
                  size={16}
                  className="ml-1 transition-transform group-hover:translate-x-1"
                />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
