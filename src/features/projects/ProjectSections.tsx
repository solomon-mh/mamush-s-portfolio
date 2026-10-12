import { Lightbox, LightboxTrigger, type LightboxItem } from "@/components/gallery/Lightbox";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { Prose } from "@/components/ui/Prose";
import type { ArtImage, ProjectSectionContent } from "@/content/types";
import { altText } from "@/lib/images";
import { cx } from "@/lib/utils";

function ImageGroup({ images, layout, label }: { images: ArtImage[]; layout?: string; label: string }) {
  const items: LightboxItem[] = images.map((img, i) => ({
    id: `${label}-${i}`,
    title: img.caption || `${label}, image ${i + 1}`,
    lines: [],
    image: img.src,
    alt: altText(img, img.caption || label),
  }));

  return (
    <Lightbox items={items} label={`${label} viewer`}>
      <ul
        role="list"
        className={cx(
          "grid gap-8",
          layout === "pairs" && "md:grid-cols-2 md:items-start",
          layout === "sheet" && "grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
        )}
      >
        {images.map((img, i) => (
          <li key={i}>
            <figure>
              <LightboxTrigger index={i} label={img.caption || `${label}, image ${i + 1}`}>
                <ArtworkImage
                  image={img}
                  fallbackAlt={img.caption || label}
                  sizes={
                    layout === "sheet"
                      ? "(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 50vw"
                      : layout === "pairs"
                        ? "(min-width: 1440px) 640px, (min-width: 768px) 46vw, 100vw"
                        : "(min-width: 1440px) 1280px, 100vw"
                  }
                />
              </LightboxTrigger>
              {img.caption && <figcaption className="mt-2 text-label text-graphite">{img.caption}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>
    </Lightbox>
  );
}

/** Renders the author's project sections in order. */
export function ProjectSections({ sections, projectTitle }: { sections?: ProjectSectionContent[]; projectTitle: string }) {
  if (!sections?.length) return null;
  return (
    <div className="flex flex-col gap-24 md:gap-36">
      {sections.map((section, i) => {
        switch (section.type) {
          case "text":
            return (
              <section key={i} className="grid gap-6 md:grid-cols-12 md:gap-8">
                {section.heading && <h2 className="font-display text-title md:col-span-4">{section.heading}</h2>}
                <Prose text={section.body} className={cx("text-lede", section.heading ? "md:col-span-7 md:col-start-6" : "md:col-span-7 md:col-start-4")} />
              </section>
            );
          case "images":
            return (
              <section key={i} aria-label={section.heading}>
                {section.heading && <h2 className="mb-8 font-display text-title">{section.heading}</h2>}
                <ImageGroup images={section.images} layout={section.layout ?? "pairs"} label={section.heading || projectTitle} />
              </section>
            );
          case "video":
            return (
              <section key={i} aria-label={section.heading ?? section.video.title}>
                {section.heading && <h2 className="mb-8 font-display text-title">{section.heading}</h2>}
                <VideoPlayer
                  video={section.video}
                  poster={<ArtworkImage image={section.video.poster} fallbackAlt="" aspectRatio={16 / 9} sizes="(min-width: 1440px) 1280px, 100vw" />}
                />
              </section>
            );
        }
      })}
    </div>
  );
}
