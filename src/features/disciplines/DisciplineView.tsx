import Link from "next/link";
import { ArtworkGallery, type GalleryArrangement } from "@/components/gallery/ArtworkGallery";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { Prose } from "@/components/ui/Prose";
import { EmptyState } from "@/components/ui/States";
import type { ArtworkCard, getDisciplinePage, ProjectCard } from "@/content";
import { cx } from "@/lib/utils";
import { ProjectGrid, ProjectIndex, ScreeningList } from "./ProjectLists";

type Discipline = NonNullable<ReturnType<typeof getDisciplinePage>>;

/** Groups artworks by their series name, keeping order; unnamed works come first. */
export function groupBySeries(artworks: ArtworkCard[]): { series: string | null; artworks: ArtworkCard[] }[] {
  const groups = new Map<string, ArtworkCard[]>();
  for (const artwork of artworks) {
    const key = artwork.series?.trim() || "";
    groups.set(key, [...(groups.get(key) ?? []), artwork]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => (a === "" ? -1 : b === "" ? 1 : 0))
    .map(([series, list]) => ({ series: series || null, artworks: list }));
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function DisciplineView({ discipline }: { discipline: Discipline }) {
  const { layout, title, projects, artworks } = discipline;
  const isEmpty = projects.length === 0 && artworks.length === 0 && !discipline.showreel;
  const night = layout === "screening";

  return (
    <div data-surface={night ? "night" : undefined} className={cx(night && "bg-ink text-paper")}>
      <div className="page-gutter mx-auto max-w-page pb-24 pt-10 md:pb-36 md:pt-16">
        <header className="mb-16 grid gap-8 md:mb-24 md:grid-cols-12">
          <nav aria-label="Breadcrumb" className="md:col-span-12">
            <Link href="/work" className={cx("link-quiet inline-flex min-h-11 items-center text-label", night ? "text-paper/70" : "text-graphite")}>
              All work
            </Link>
          </nav>
          <h1 className="font-display text-display md:col-span-7">{title}</h1>
          <div className="md:col-span-5 md:pt-3">
            {discipline.introduction ? (
              <Prose text={discipline.introduction} className={cx("text-lede", night ? "text-paper/85" : "text-graphite")} />
            ) : (
              discipline.shortDescription && (
                <p className={cx("max-w-prose text-lede", night ? "text-paper/85" : "text-graphite")}>{discipline.shortDescription}</p>
              )
            )}
          </div>
        </header>

        {isEmpty ? (
          <EmptyState title={`New ${title.toLowerCase()} work is on its way`} action={{ href: "/work", label: "Browse all work" }}>
            <p>Nothing has been published in this discipline yet.</p>
          </EmptyState>
        ) : layout === "screening" ? (
          <ScreeningLayout discipline={discipline} projects={projects} artworks={artworks} />
        ) : (
          <StandardLayout layout={layout} title={title} projects={projects} artworks={artworks} />
        )}
      </div>
    </div>
  );
}

function StandardLayout({
  layout,
  title,
  projects,
  artworks,
}: {
  layout: string;
  title: string;
  projects: ProjectCard[];
  artworks: ArtworkCard[];
}) {
  const groups = groupBySeries(artworks);
  const named = groups.filter((g) => g.series);
  const arrangement: GalleryArrangement = layout === "gallery" ? "wall" : "masonry";
  const projectsFirst = layout === "index";

  const projectSection = projects.length > 0 && (
    <section aria-labelledby="projects-heading" className="mb-24 md:mb-36">
      <h2 id="projects-heading" className="mb-10 font-display text-title">
        Projects
      </h2>
      {layout === "index" ? <ProjectIndex projects={projects} /> : <ProjectGrid projects={projects} />}
    </section>
  );

  const artworkSection = artworks.length > 0 && (
    <section aria-label={`${title} artworks`} className="mb-24 md:mb-36">
      {named.length > 1 && (
        <nav aria-label="Series" className="mb-12 flex flex-wrap gap-x-6 gap-y-1 border-y border-rule py-3">
          {named.map((g) => (
            <a key={g.series} href={`#series-${slugify(g.series!)}`} className="link-quiet inline-flex min-h-11 items-center">
              {g.series}
            </a>
          ))}
        </nav>
      )}
      <div className="flex flex-col gap-24 md:gap-36">
        {groups.map((group) => (
          <div key={group.series ?? "_"} id={group.series ? `series-${slugify(group.series)}` : undefined} className="scroll-mt-8">
            {group.series && <h2 className="mb-10 font-display text-title italic">{group.series}</h2>}
            <ArtworkGallery
              artworks={group.artworks}
              arrangement={arrangement}
              label={group.series ? `${group.series} viewer` : `${title} viewer`}
              headingLevel={group.series ? "h3" : "h2"}
            />
          </div>
        ))}
      </div>
    </section>
  );

  return projectsFirst ? (
    <>
      {projectSection}
      {artworkSection}
    </>
  ) : (
    <>
      {artworkSection}
      {projectSection}
    </>
  );
}

function ScreeningLayout({
  discipline,
  projects,
  artworks,
}: {
  discipline: Discipline;
  projects: ProjectCard[];
  artworks: ArtworkCard[];
}) {
  const reel = discipline.showreel;
  return (
    <>
      {reel && (
        <section aria-labelledby="showreel-heading" className="mb-24 md:mb-36">
          <h2 id="showreel-heading" className="sr-only">
            Showreel
          </h2>
          <VideoPlayer
            video={reel}
            tone="night"
            poster={<ArtworkImage image={reel.poster} fallbackAlt="" aspectRatio={16 / 9} priority sizes="(min-width: 1440px) 1280px, 100vw" />}
          />
        </section>
      )}
      {projects.length > 0 && (
        <section aria-labelledby="films-heading" className="mb-24 md:mb-36">
          <h2 id="films-heading" className="mb-10 font-display text-title">
            Films and projects
          </h2>
          <ScreeningList projects={projects} />
        </section>
      )}
      {artworks.length > 0 && (
        <section aria-labelledby="stills-heading">
          <h2 id="stills-heading" className="mb-10 font-display text-title">
            Stills, frames and studies
          </h2>
          <div className="[&_.text-graphite]:text-paper/70 [&_.text-ink]:text-paper">
            <ArtworkGallery artworks={artworks} arrangement="masonry" label="Stills viewer" />
          </div>
        </section>
      )}
    </>
  );
}
