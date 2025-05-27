// app/evenements/page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUpcomingEvents, getPastEvents } from "@/lib/event";
import { EventsGrid } from "@/components/events/events-grid";

export const metadata = {
  title: "Événements | Portfolio Artistique",
  description:
    "Découvrez les événements artistiques à venir et passés: expositions, vernissages, ateliers et rencontres.",
};

export default async function EventsPage() {
  const upcomingEvents = await getUpcomingEvents();
  const pastEvents = await getPastEvents();

  return (
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-playfair mb-8 text-center">
          Événements
        </h1>

        <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
          Retrouvez tous mes événements artistiques : expositions, vernissages,
          ateliers et rencontres.
        </p>

        <Tabs defaultValue="upcoming" className="w-full mt-12">
          <TabsList className="grid grid-cols-2 h-auto max-w-md mx-auto">
            <TabsTrigger value="upcoming" className="py-3">
              À venir ({upcomingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="py-3">
              Passés ({pastEvents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-8">
            {upcomingEvents.length > 0 ? (
              <EventsGrid events={upcomingEvents} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Aucun événement à venir pour le moment.
                </p>
                <p className="text-muted-foreground">
                  Restez connecté pour ne manquer aucune actualité !
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-8">
            {pastEvents.length > 0 ? (
              <EventsGrid events={pastEvents} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Aucun événement passé à afficher.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
