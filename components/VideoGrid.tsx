import { parseVideo } from "@/lib/video";
import { Reveal, RevealScale } from "./Reveal";

/** Responsive grid of video players: uploaded files, YouTube and Vimeo links. */
export function VideoGrid({
  videos,
  badge,
  headline,
  className = "bg-sand-raised py-16",
}: {
  videos: string[];
  badge?: string;
  headline: string;
  className?: string;
}) {
  if (videos.length === 0) return null;
  const single = videos.length === 1;

  return (
    <section className={className}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
        <Reveal className="mb-10 text-center">
          {badge && (
            <span className="inline-block mb-3 text-clay text-xs font-semibold uppercase tracking-widest">
              {badge}
            </span>
          )}
          <h2 className="font-display text-2xl md:text-3xl text-ink">{headline}</h2>
        </Reveal>

        <div className={`grid gap-6 ${single ? "max-w-4xl mx-auto" : "sm:grid-cols-2"}`}>
          {videos.map((url, i) => {
            const v = parseVideo(url);
            return (
              <RevealScale key={`${url}-${i}`} delay={(i % 2) * 120}>
                <div className="relative aspect-video overflow-hidden rounded-xl bg-ink shadow-[0_4px_12px_rgba(42,36,32,0.08),0_16px_32px_rgba(42,36,32,0.12)] ring-1 ring-border">
                  {v.kind === "embed" ? (
                    <iframe
                      src={v.src}
                      title={`Video ${i + 1}`}
                      loading="lazy"
                      allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  ) : (
                    <video
                      // #t=0.1 makes browsers show the first frame as the poster
                      src={`${v.src}#t=0.1`}
                      controls
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 h-full w-full object-contain bg-ink"
                    />
                  )}
                </div>
              </RevealScale>
            );
          })}
        </div>
      </div>
    </section>
  );
}
