import { format } from "date-fns";

export const formatDate = (iso: string) => format(new Date(iso), "dd MMM yyyy");

// "Dr. Ayesha Rahman" -> "AR"
export function getInitials(name: string) {
    return name
        .replace(/^dr\.?\s+/i, "")
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

// The API treats "to" as midnight UTC, which would exclude the whole last day.
// Sending the end of that day makes the range inclusive, as users expect.
export const toEndOfDay = (date?: string) => (date ? `${date}T23:59:59.999Z` : undefined);