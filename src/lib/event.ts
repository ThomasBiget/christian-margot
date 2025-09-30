// lib/event.ts
import { prisma } from "@/lib/prisma";
import { Event, EventImage } from "@prisma/client";

export type EventWithImages = Event & {
  images: EventImage[];
};

export async function getAllEvents(): Promise<EventWithImages[]> {
  try {
    return await prisma.event.findMany({
      include: {
        images: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });
  } catch (error) {
    console.warn(
      "Base de données indisponible pour getAllEvents, retour tableau vide.",
      error
    );
    return [];
  }
}

export async function getUpcomingEvents(): Promise<EventWithImages[]> {
  try {
    const now = new Date();
    return await prisma.event.findMany({
      where: {
        endDate: {
          gte: now,
        },
      },
      include: {
        images: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    });
  } catch (error) {
    console.warn(
      "Base de données indisponible pour getUpcomingEvents, retour tableau vide.",
      error
    );
    return [];
  }
}

export async function getPastEvents(): Promise<EventWithImages[]> {
  try {
    const now = new Date();
    return await prisma.event.findMany({
      where: {
        endDate: {
          lt: now,
        },
      },
      include: {
        images: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });
  } catch (error) {
    console.warn(
      "Base de données indisponible pour getPastEvents, retour tableau vide.",
      error
    );
    return [];
  }
}

export async function getEventById(
  id: string
): Promise<EventWithImages | null> {
  try {
    return await prisma.event.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });
  } catch (error) {
    console.warn(
      "Base de données indisponible pour getEventById, retour null.",
      error
    );
    return null;
  }
}

export async function getFeaturedEvents(
  limit: number = 6
): Promise<EventWithImages[]> {
  try {
    return await prisma.event.findMany({
      where: {
        featured: true,
      },
      include: {
        images: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
      take: limit,
    });
  } catch (error) {
    console.warn(
      "Base de données indisponible pour getFeaturedEvents, retour tableau vide.",
      error
    );
    return [];
  }
}

export async function createEvent(data: {
  title: string;
  description: string;
  mainImageUrl: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  featured?: boolean;
}): Promise<Event> {
  return await prisma.event.create({
    data,
  });
}

export async function updateEvent(
  id: string,
  data: {
    title?: string;
    description?: string;
    mainImageUrl?: string;
    startDate?: Date;
    endDate?: Date;
    location?: string;
    featured?: boolean;
  }
): Promise<Event> {
  return await prisma.event.update({
    where: { id },
    data,
  });
}

export async function deleteEvent(id: string): Promise<void> {
  await prisma.event.delete({
    where: { id },
  });
}

export async function addEventImages(
  eventId: string,
  imageUrls: string[]
): Promise<EventImage[]> {
  const images = imageUrls.map((url, index) => ({
    eventId,
    imageUrl: url,
    order: index,
  }));

  return await prisma.eventImage.createManyAndReturn({
    data: images,
  });
}

export async function deleteEventImage(imageId: string): Promise<void> {
  await prisma.eventImage.delete({
    where: { id: imageId },
  });
}

// Fonction utilitaire pour vérifier si un événement est en cours
export function isEventOngoing(event: Event): boolean {
  const now = new Date();
  return now >= event.startDate && now <= event.endDate;
}

// Fonction utilitaire pour vérifier si un événement est passé
export function isEventPast(event: Event): boolean {
  const now = new Date();
  return now > event.endDate;
}

// Fonction utilitaire pour vérifier si un événement est à venir
export function isEventUpcoming(event: Event): boolean {
  const now = new Date();
  return now < event.startDate;
}
