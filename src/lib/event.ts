// lib/event.ts
import { prisma } from "@/lib/prisma";
import { Event, EventImage } from "@prisma/client";

export type EventWithImages = Event & {
  images: EventImage[];
};

export async function getAllEvents(): Promise<EventWithImages[]> {
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
}

export async function getUpcomingEvents(): Promise<EventWithImages[]> {
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
}

export async function getPastEvents(): Promise<EventWithImages[]> {
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
}

export async function getEventById(
  id: string
): Promise<EventWithImages | null> {
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
}

export async function getFeaturedEvents(
  limit: number = 6
): Promise<EventWithImages[]> {
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
