import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ApiError } from "@/lib/api";

// Returns true if at least one field error was applied
export function applyFieldErrors<T extends FieldValues>(
    error: unknown,
    setError: UseFormSetError<T>
) {
    if (!(error instanceof ApiError) || !error.fieldErrors) return false;

    let applied = false;
    for (const [field, messages] of Object.entries(error.fieldErrors)) {
        if (messages?.[0]) {
            setError(field as Path<T>, { type: "server", message: messages[0] });
            applied = true;
        }
    }
    return applied;
}