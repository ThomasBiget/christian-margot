// app/admin/evenements/nouveau/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CreateEventForm } from "@/components/admin/create-event-form";

export default async function NewEventPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-playfair mb-8">
          Créer un nouvel événement
        </h1>
        <CreateEventForm />
      </div>
    </div>
  );
}
