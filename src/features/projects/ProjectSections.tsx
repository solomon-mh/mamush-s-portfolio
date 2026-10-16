import { JustifiedRows } from "@/components/gallery/JustifiedRows";
import { Lightbox, LightboxTrigger, type LightboxItem } from "@/components/gallery/Lightbox";
import { SplitSection } from "@/components/layout/SplitSection";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { Prose } from "@/components/ui/Prose";
import type { ArtImage, ProjectSectionContent } from "@/content/types";
import { altText } from "@/lib/images";

const GROUP_SCALE = {
  stack: { rowHeight: 640, maxRowHeight: 720, maxPerRow: 1 },
  pairs: { rowHeight: 460, maxRowHeight: 560, maxPerRow: 2 },
  sheet: { rowHeight: 240, maxRowHeight: 320, maxPerRow: 4 },
} as const;

function ImageGroup({ images, layout = "pairs", label }: { images: ArtImage[]; layout?: keyof typeof GROUP_SCALE; label: string }) {
  const items: LightboxItem[] = images.map((img, i) => ({
    id: `${label}-${i}`,
    title: img.caption || `${label}, image ${i + 1}`,
    lines: [],
    image: img.src,
    alt: altText(img, img.caption || label),
  }));
  const entries = images.map((img, i) => ({ key: `${label}-${i}`, ratio: img.src.width / img.src.height, img, i }));

  return (
    <Lightbox items={items} label={`${label} viewer`}>
      <JustifiedRows
        items={entries}
        {...GROUP_SCALE[layout]}
        renderItem={({ img, i }, sizes) => (
          <figure className="group">
            <LightboxTrigger index={i} label={img.caption || `${label}, image ${i + 1}`}>
              <ArtworkImage image={img} fallbackAlt={img.caption || label} sizes={sizes} className="card-media" />
            </LightboxTrigger>
            {img.caption && <figcaption className="mt-2 text-label text-graphite">{img.caption}</figcaption>}
          </figure>
        )}
      />
    </Lightbox>
  );
}

/** Renders the author's project sections in order. */
export function ProjectSections({ sections, projectTitle }: { sections?: ProjectSectionContent[]; projectTitle: string }) {
  if (!sections?.length) return null;
  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {sections.map((section, i) => {
        switch (section.type) {
          case "text":
            return (
              <SplitSection key={i} id={`section-${i}`} title={section.heading}>
                <Prose text={section.body} className="text-lede text-ink-soft" />
              </SplitSection>
            );
          case "images":
            return (
              <section key={i} aria-label={section.heading ?? `${projectTitle} images`}>
                {section.heading && (
                  <h2 className="mb-8 border-t border-rule pt-8 font-display text-title md:pt-10">{section.heading}</h2>
                )}
                <ImageGroup images={section.images} layout={section.layout ?? "pairs"} label={section.heading || projectTitle} />
              </section>
            );
          case "video":
            return (
              <section key={i} aria-label={section.heading ?? section.video.title}>
                {section.heading && (
                  <h2 className="mb-8 border-t border-rule pt-8 font-display text-title md:pt-10">{section.heading}</h2>
                )}
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
