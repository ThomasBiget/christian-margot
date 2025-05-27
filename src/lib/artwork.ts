import { Artwork } from "../types";

// Mock data until Prisma is connected to a database
const artworks: Artwork[] = [
  {
    id: "1",
    title: "Nature Morte à la Fenêtre",
    description:
      "Une composition d'objets du quotidien baignés dans la lumière naturelle d'une fenêtre, jouant sur les contrastes et la transparence du verre.",
    imageUrl:
      "https://images.pexels.com/photos/1568607/pexels-photo-1568607.jpeg",
    category: "peinture",
    subcategory: "huile",
    featured: true,
    createdAt: new Date("2023-06-15"),
  },
  {
    id: "2",
    title: "Fragments d'Âme",
    description:
      "Un assemblage délicat de papiers anciens et de photographies, créant une narration visuelle sur le passage du temps et la mémoire collective.",
    imageUrl:
      "https://images.pexels.com/photos/4842487/pexels-photo-4842487.jpeg",
    category: "collage",
    featured: true,
    createdAt: new Date("2023-08-20"),
  },
  {
    id: "3",
    title: "Lignes d'Horizon",
    description:
      "Une exploration minutieuse au stylo fin noir des lignes qui composent un paysage urbain vu de haut, oscillant entre réalisme architectural et abstraction.",
    imageUrl:
      "https://images.pexels.com/photos/3660033/pexels-photo-3660033.jpeg",
    category: "stylo",
    featured: true,
    createdAt: new Date("2023-09-10"),
  },
  {
    id: "4",
    title: "Métamorphose",
    description:
      "Une forme organique modelée en argile qui évoque la transformation et l'évolution, inspirée par les processus naturels de croissance.",
    imageUrl:
      "https://images.pexels.com/photos/2123337/pexels-photo-2123337.jpeg",
    category: "modelage",
    featured: true,
    createdAt: new Date("2023-11-05"),
  },
  {
    id: "5",
    title: "Reflets d'Âme",
    description:
      "Une aquarelle délicate capturant les nuances de la lumière sur l'eau, évoquant la fluidité des émotions humaines.",
    imageUrl:
      "https://images.pexels.com/photos/3246665/pexels-photo-3246665.jpeg",
    category: "peinture",
    subcategory: "aquarelle",
    featured: true,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "6",
    title: "Vibrations Intérieures",
    description:
      "Une exploration des formes géométriques en mouvement, créée avec des couleurs acryliques vives sur une toile de grand format.",
    imageUrl:
      "https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg",
    category: "peinture",
    subcategory: "acrylique",
    createdAt: new Date("2023-12-12"),
  },
  {
    id: "7",
    title: "Résonance",
    description:
      "Une composition harmonieuse explorant la relation entre différentes textures et matières, avec des détails minutieux au stylo.",
    imageUrl:
      "https://images.pexels.com/photos/3705943/pexels-photo-3705943.jpeg",
    category: "stylo",
    createdAt: new Date("2023-10-18"),
  },
  {
    id: "8",
    title: "Éclosion",
    description:
      "Une sculpture modelée représentant l'émergence et le renouveau, inspirée par les formes organiques de la nature.",
    imageUrl:
      "https://images.pexels.com/photos/2479313/pexels-photo-2479313.jpeg",
    category: "modelage",
    createdAt: new Date("2023-07-30"),
  },
  {
    id: "9",
    title: "Harmonie Éphémère",
    description:
      "Une œuvre à la cire explorant la translucidité et les jeux de lumière, créant une atmosphère douce et contemplative.",
    imageUrl:
      "https://images.pexels.com/photos/1569004/pexels-photo-1569004.jpeg",
    category: "peinture",
    subcategory: "cire",
    createdAt: new Date("2024-02-05"),
  },
  {
    id: "10",
    title: "Souvenirs Fragmentés",
    description:
      "Un collage mélangeant textures et souvenirs anciens, reconstruisant une narration personnelle à travers des éléments disparates.",
    imageUrl:
      "https://images.pexels.com/photos/6069544/pexels-photo-6069544.jpeg",
    category: "collage",
    createdAt: new Date("2023-05-22"),
  },
  {
    id: "11",
    title: "Profondeur Marine",
    description:
      "Une exploration des teintes bleues et vertes en huile sur toile, évoquant les mystères des fonds marins et leur richesse.",
    imageUrl:
      "https://images.pexels.com/photos/2179483/pexels-photo-2179483.jpeg",
    category: "peinture",
    subcategory: "huile",
    createdAt: new Date("2023-08-14"),
  },
  {
    id: "12",
    title: "Constellation Urbaine",
    description:
      "Une composition au stylo noir représentant une ville la nuit, où les lumières créent un réseau semblable aux étoiles.",
    imageUrl:
      "https://images.pexels.com/photos/235615/pexels-photo-235615.jpeg",
    category: "stylo",
    createdAt: new Date("2023-06-28"),
  },
];

// Function to get featured artworks for the homepage
export async function getFeaturedArtworks(): Promise<Artwork[]> {
  // This would be a database query in a real application
  return artworks
    .filter((artwork) => artwork.featured)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// Function to get artworks by category
export async function getArtworksByCategory(
  category: string
): Promise<Artwork[]> {
  // This would be a database query in a real application
  return artworks
    .filter(
      (artwork) => artwork.category.toLowerCase() === category.toLowerCase()
    )
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// Function to get a single artwork by ID
export async function getArtworkById(id: string): Promise<Artwork | null> {
  // This would be a database query in a real application
  const artwork = artworks.find((artwork) => artwork.id === id);
  return artwork || null;
}

// Function to get related artworks
export async function getRelatedArtworks(
  category: string,
  excludeId: string
): Promise<Artwork[]> {
  // This would be a database query in a real application
  return artworks
    .filter(
      (artwork) => artwork.category === category && artwork.id !== excludeId
    )
    .sort(() => Math.random() - 0.5) // Shuffle array for random selection
    .slice(0, 4); // Return only 4 artworks
}
