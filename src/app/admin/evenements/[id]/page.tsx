// app/admin/evenements/[id]/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getEventById } from "@/lib/event";
import { EditEventForm } from "@/components/admin/edit-event-form";

interface EditEventPageProps {
  params: {
    id: string;
  };
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const event = await getEventById(params.id);

  if (!event) {
    redirect("/admin/evenements");
  }

  return (
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-playfair mb-8">
          Modifier l&apos;événement
        </h1>
        <EditEventForm event={event} />
      </div>
    </div>
  );
}
