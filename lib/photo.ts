/**
 * Marker stored in a photo field to mean "show no photo here" (as opposed to an
 * empty field, which means "use the default photo"). Pure module: safe in client code.
 */
export const NO_PHOTO = "none";

/** Resolve a photo field: explicit "none" -> null, empty -> fallback. */
export function photoOr(value: string | undefined, fallback?: string | null): string | null {
  if (value === NO_PHOTO) return null;
  return value || fallback || null;
}
