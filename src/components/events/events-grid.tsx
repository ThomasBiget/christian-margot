// components/events/events-grid.tsx
import Image from "next/image";
import Link from "next/link";
import { EventWithImages } from "@/lib/event";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface EventsGridProps {
  events: EventWithImages[];
}

export function EventsGrid({ events }: EventsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <Link key={event.id} href={`/evenements/${event.id}`}>
          <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={event.mainImageUrl}
                alt={event.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {event.featured && (
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  À la une
                </div>
              )}
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(event.date), "d MMMM yyyy", { locale: fr })}
                </span>
              </div>

              {event.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              )}

              <h3 className="text-xl font-playfair mb-3 group-hover:text-primary transition-colors">
                {event.title}
              </h3>

              <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                {event.description}
              </p>

              {event.images.length > 0 && (
                <div className="flex items-center gap-1 mt-4 text-sm text-muted-foreground">
                  <span>
                    {event.images.length} photo
                    {event.images.length > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
