// Maps a sector icon to the in-page anchor of its detail section on /services.
const ANCHORS: Record<string, string> = {
  "🎓": "#graduates",
  "🏥": "#doctors",
  "⚖️": "#lawyers",
  "🏫": "#teachers",
  "💼": "#business",
};

export function sectorAnchor(icon: string): string {
  return ANCHORS[icon] ?? "";
}
