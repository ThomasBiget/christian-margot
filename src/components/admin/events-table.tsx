// components/admin/events-table.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { EventWithImages, isEventPast } from "@/lib/event";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, Calendar, MapPin, Star } from "lucide-react";
import { formatEventPeriodShort } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EventsTableProps {
  events: EventWithImages[];
}

export function EventsTable({ events }: EventsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);

      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      if (response.status === 401) {
        toast.error("Session expirée. Veuillez vous reconnecter.");
        const callbackUrl = encodeURIComponent("/admin/evenements");
        router.push(`/admin/login?callbackUrl=${callbackUrl}`);
        return;
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Événement supprimé avec succès");
        router.refresh();
      } else {
        throw new Error(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la suppression de l'événement");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Image</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead>Période</TableHead>
            <TableHead>Lieu</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Photos</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <div className="relative w-16 h-12 rounded overflow-hidden">
                  <Image
                    src={event.mainImageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {event.description}
                    </div>
                  </div>
                  {event.featured && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatEventPeriodShort(event.startDate, event.endDate)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {event.location ? (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">
                    Non défini
                  </span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={isEventPast(event) ? "secondary" : "default"}>
                  {isEventPast(event) ? "Passé" : "À venir"}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {event.images.length} photo
                  {event.images.length > 1 ? "s" : ""}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 justify-end">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/evenements/${event.id}`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={deletingId === event.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Supprimer l&apos;événement
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer l&apos;événement
                          &ldquo;
                          {event.title}&rdquo; ? Cette action est irréversible
                          et supprimera également toutes les photos associées.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(event.id)}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={deletingId === event.id}
                        >
                          {deletingId === event.id
                            ? "Suppression..."
                            : "Supprimer"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {events.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Aucun événement trouvé.</p>
        </div>
      )}
    </div>
  );
}
