// components/events/related-events.tsx
import Image from "next/image";
import Link from "next/link";
import { EventWithImages } from "@/lib/event";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface RelatedEventsProps {
  events: EventWithImages[];
}

export function RelatedEvents({ events }: RelatedEventsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Link key={event.id} href={`/evenements/${event.id}`}>
          <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={event.mainImageUrl}
                alt={event.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Calendar className="w-3 h-3" />
                <span>
                  {format(new Date(event.date), "d MMM yyyy", { locale: fr })}
                </span>
              </div>

              {event.location && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{event.location}</span>
                </div>
              )}

              <h3 className="font-playfair mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {event.title}
              </h3>

              <p className="text-muted-foreground line-clamp-2 text-sm">
                {event.description}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
