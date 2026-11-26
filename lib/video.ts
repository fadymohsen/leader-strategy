/** Pure helpers for video URLs (safe in server and client code). */

export type VideoSource =
  | { kind: "file"; src: string }
  | { kind: "embed"; src: string; provider: "youtube" | "vimeo" };

const YT = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i;
const VIMEO = /vimeo\.com\/(?:video\/)?(\d+)/i;

export function parseVideo(url: string): VideoSource {
  const yt = url.match(YT);
  if (yt) {
    return { kind: "embed", provider: "youtube", src: `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0` };
  }
  const vm = url.match(VIMEO);
  if (vm) {
    return { kind: "embed", provider: "vimeo", src: `https://player.vimeo.com/video/${vm[1]}` };
  }
  return { kind: "file", src: url };
}

export function isVideoUrl(url: string, contentType?: string | null): boolean {
  if (contentType?.startsWith("video/")) return true;
  return /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(url) || YT.test(url) || VIMEO.test(url);
}

export const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/ogg"];
