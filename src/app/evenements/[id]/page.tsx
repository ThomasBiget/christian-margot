// app/evenements/[id]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getEventById, getFeaturedEvents } from "@/lib/event";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin } from "lucide-react";
import { formatEventDateTime } from "@/lib/utils";
import { EventGallery } from "@/components/events/event-gallery";
import { RelatedEvents } from "@/components/events/related-events";

interface EventPageParams {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: EventPageParams): Promise<Metadata> {
  const event = await getEventById(params.id);

  if (!event) {
    return { title: "Événement non trouvé" };
  }

  return {
    title: `${event.title} | Événements`,
    description: event.description,
  };
}

export default async function EventPage({ params }: EventPageParams) {
  const event = await getEventById(params.id);

  if (!event) {
    notFound();
  }

  const relatedEvents = await getFeaturedEvents(3);
  const filteredRelatedEvents = relatedEvents.filter((e) => e.id !== event.id);

  return (
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md">
            <Image
              src={event.mainImageUrl}
              alt={event.title}
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-playfair mb-6">
              {event.title}
            </h1>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 text-muted-foreground">
                <Calendar className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-lg leading-relaxed">
                  {formatEventDateTime(event.startDate, event.endDate)}
                </span>
              </div>

              {event.location && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg">{event.location}</span>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            <div className="prose prose-sm max-w-none">
              <p className="text-foreground whitespace-pre-line text-base leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        </div>

        {event.images.length > 0 && (
          <div className="mb-20">
            <h2 className="text-2xl font-playfair mb-8">Galerie photos</h2>
            <EventGallery images={event.images} eventTitle={event.title} />
          </div>
        )}

        {filteredRelatedEvents.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-playfair mb-8">Autres événements</h2>
            <RelatedEvents events={filteredRelatedEvents} />
          </div>
        )}
      </div>
    </div>
  );
}
