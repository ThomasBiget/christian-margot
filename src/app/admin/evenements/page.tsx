// app/admin/evenements/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAllEvents } from "@/lib/event";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { EventsTable } from "@/components/admin/events-table";

export default async function AdminEventsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const events = await getAllEvents();

  return (
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-playfair">Gestion des événements</h1>
          <Link href="/admin/evenements/nouveau">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvel événement
            </Button>
          </Link>
        </div>

        <EventsTable events={events} />
      </div>
    </div>
  );
}
