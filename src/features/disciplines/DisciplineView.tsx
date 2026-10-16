import { ArtworkGallery } from "@/components/gallery/ArtworkGallery";
import { PageHeader } from "@/components/layout/PageHeader";
import { ArtworkImage } from "@/components/media/ArtworkImage";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { DisciplineSwitcher } from "@/components/navigation/DisciplineSwitcher";
import { Prose } from "@/components/ui/Prose";
import { EmptyState } from "@/components/ui/States";
import type { ArtworkCard, getDisciplinePage, ProjectCard } from "@/content";
import { cx } from "@/lib/utils";
import { ProjectGrid, ProjectIndex, ScreeningList } from "./ProjectLists";

type Discipline = NonNullable<ReturnType<typeof getDisciplinePage>>;
type SwitcherItem = { href: string; label: string; count?: number; active: boolean };

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

export function DisciplineView({ discipline, switcher }: { discipline: Discipline; switcher: SwitcherItem[] }) {
  const { layout, title, projects, artworks } = discipline;
  const isEmpty = projects.length === 0 && artworks.length === 0 && !discipline.showreel;
  const night = layout === "screening";
  const intro = discipline.introduction ? (
    <Prose text={discipline.introduction} />
  ) : (
    discipline.shortDescription
  );

  return (
    <div data-surface={night ? "night" : undefined} className={cx(night && "bg-ink text-paper")}>
      <PageHeader title={title} intro={intro} breadcrumb={[{ href: "/work", label: "Work" }]} tone={night ? "night" : "paper"}>
        <DisciplineSwitcher items={switcher} label="Disciplines" tone={night ? "night" : "paper"} />
      </PageHeader>

      <div className="page-gutter mx-auto max-w-page pb-20 md:pb-28">
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

function SectionTitle({ id, children, count, className }: { id?: string; children: string; count?: number; className?: string }) {
  return (
    <div className={cx("mb-8 flex items-baseline justify-between gap-4 border-t border-current/15 pt-5 md:mb-10", className)}>
      <h2 id={id} className="font-display text-title">
        {children}
      </h2>
      {count !== undefined && (
        <span className="text-label opacity-60">
          {count} {count === 1 ? "work" : "works"}
        </span>
      )}
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
  const scale = layout === "gallery" ? "exhibition" : "grid";
  const projectsFirst = layout === "index";

  const projectSection = projects.length > 0 && (
    <section aria-labelledby="projects-heading" className="mb-20 md:mb-28">
      <SectionTitle id="projects-heading" count={projects.length}>
        Projects
      </SectionTitle>
      {layout === "index" ? <ProjectIndex projects={projects} /> : <ProjectGrid projects={projects} />}
    </section>
  );

  const artworkSection = artworks.length > 0 && (
    <section aria-label={`${title} artworks`} className="mb-20 md:mb-28">
      {named.length > 1 && (
        <nav aria-label="Series" className="mb-12 flex flex-wrap items-center gap-2">
          <span className="mr-2 text-label text-graphite">Jump to</span>
          {named.map((g) => (
            <a key={g.series} href={`#series-${slugify(g.series!)}`} className="chip">
              {g.series}
              <span className="chip-count">{g.artworks.length}</span>
            </a>
          ))}
        </nav>
      )}
      <div className="flex flex-col gap-20 md:gap-28">
        {groups.map((group) => (
          <section
            key={group.series ?? "_"}
            id={group.series ? `series-${slugify(group.series)}` : undefined}
            aria-label={group.series ?? `${title}`}
          >
            {group.series ? (
              <SectionTitle count={group.artworks.length}>{group.series}</SectionTitle>
            ) : (
              named.length > 0 && <SectionTitle count={group.artworks.length}>Individual works</SectionTitle>
            )}
            <ArtworkGallery
              artworks={group.artworks}
              scale={scale}
              label={group.series ? `${group.series} viewer` : `${title} viewer`}
              headingLevel={group.series || named.length > 0 ? "h3" : "h2"}
            />
          </section>
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
        <section aria-labelledby="showreel-heading" className="mb-20 md:mb-28">
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
        <section aria-labelledby="films-heading" className="mb-20 md:mb-28">
          <SectionTitle id="films-heading" count={projects.length}>
            Films and projects
          </SectionTitle>
          <ScreeningList projects={projects} />
        </section>
      )}
      {artworks.length > 0 && (
        <section aria-labelledby="stills-heading">
          <SectionTitle id="stills-heading" count={artworks.length}>
            Stills and frames
          </SectionTitle>
          <div className="[&_.text-graphite]:text-paper/65 [&_.text-ink]:text-paper">
            <ArtworkGallery artworks={artworks} scale="grid" label="Stills viewer" />
          </div>
        </section>
      )}
    </>
  );
}
