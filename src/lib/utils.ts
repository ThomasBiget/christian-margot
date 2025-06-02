import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Vérifier si la date est valide
  if (isNaN(dateObj.getTime())) {
    return "Date invalide";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(dateObj);
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function slugify(text: string) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

// Fonctions utilitaires pour les événements
export function formatEventPeriod(
  startDate: Date | string,
  endDate: Date | string
) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isSameDay(start, end)) {
    return format(start, "d MMMM yyyy", { locale: fr });
  } else {
    if (
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()
    ) {
      return `${format(start, "d", { locale: fr })} - ${format(
        end,
        "d MMMM yyyy",
        { locale: fr }
      )}`;
    } else {
      return `${format(start, "d MMMM", { locale: fr })} - ${format(
        end,
        "d MMMM yyyy",
        { locale: fr }
      )}`;
    }
  }
}

export function formatEventPeriodShort(
  startDate: Date | string,
  endDate: Date | string
) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isSameDay(start, end)) {
    return format(start, "d MMM yyyy", { locale: fr });
  } else {
    if (
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()
    ) {
      return `${format(start, "d", { locale: fr })} - ${format(
        end,
        "d MMM yyyy",
        { locale: fr }
      )}`;
    } else {
      return `${format(start, "d MMM", { locale: fr })} - ${format(
        end,
        "d MMM yyyy",
        { locale: fr }
      )}`;
    }
  }
}

export function formatEventDateTime(
  startDate: Date | string,
  endDate: Date | string
) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isSameDay(start, end)) {
    // Même jour : "Vendredi 15 mars 2024 de 14h00 à 18h00"
    return `${format(start, "EEEE d MMMM yyyy", { locale: fr })} de ${format(
      start,
      "HH:mm"
    )} à ${format(end, "HH:mm")}`;
  } else {
    // Période : "Du vendredi 15 mars 2024 à 14h00 au dimanche 17 mars 2024 à 18h00"
    return `Du ${format(start, "EEEE d MMMM yyyy 'à' HH:mm", {
      locale: fr,
    })} au ${format(end, "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })}`;
  }
}
