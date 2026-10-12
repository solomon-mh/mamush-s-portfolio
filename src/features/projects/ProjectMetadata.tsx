import Link from "next/link";
import { hrefFor } from "@/lib/routes";
import type { DisciplineRef } from "@/content";

interface MetadataProps {
  client?: string | null;
  year?: number | null;
  role?: string | null;
  duration?: string | null;
  disciplines?: DisciplineRef[] | null;
}

/** Project facts as a definition list: scannable for art directors, meaningful to screen readers. */
export function ProjectMetadata({ client, year, role, duration, disciplines }: MetadataProps) {
  const visibleDisciplines = disciplines ?? [];
  const rows: Array<{ term: string; value: React.ReactNode }> = [];
  if (client) rows.push({ term: "Client", value: client });
  if (year) rows.push({ term: "Year", value: year });
  if (role) rows.push({ term: "Role", value: role });
  if (duration) rows.push({ term: "Running time", value: duration });
  if (visibleDisciplines.length) {
    rows.push({
      term: visibleDisciplines.length > 1 ? "Disciplines" : "Discipline",
      value: visibleDisciplines.map((d, i) => (
        <span key={d._id}>
          {i > 0 && ", "}
          <Link href={hrefFor("discipline", d.slug)!} className="link-quiet">
            {d.title}
          </Link>
        </span>
      )),
    });
  }
  if (rows.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-5 border-t border-rule pt-6 sm:grid-cols-3 lg:grid-cols-1">
      {rows.map((row) => (
        <div key={row.term}>
          <dt className="text-label text-graphite">{row.term}</dt>
          <dd className="mt-0.5">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CreditList({
  credits,
  collaborators,
  deliverables,
}: {
  credits?: { role: string; name: string; url?: string }[] | null;
  collaborators?: string[] | null;
  deliverables?: string[] | null;
}) {
  const validCredits = (credits ?? []).filter((c) => c.name && c.role);
  const hasAny = validCredits.length || collaborators?.length || deliverables?.length;
  if (!hasAny) return null;

  return (
    <section aria-labelledby="credits-heading" className="grid gap-10 border-t border-rule pt-10 md:grid-cols-12 md:gap-8">
      <h2 id="credits-heading" className="font-display text-title md:col-span-4">
        Credits
      </h2>
      <div className="grid gap-10 sm:grid-cols-2 md:col-span-8">
        {deliverables && deliverables.length > 0 && (
          <div>
            <h3 className="mb-3 text-label text-graphite">Deliverables</h3>
            <ul role="list" className="flex flex-col gap-1">
              {deliverables.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        )}
        {collaborators && collaborators.length > 0 && (
          <div>
            <h3 className="mb-3 text-label text-graphite">Collaborators</h3>
            <ul role="list" className="flex flex-col gap-1">
              {collaborators.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        )}
        {validCredits.length > 0 && (
          <dl className="flex flex-col gap-3 sm:col-span-2">
            {validCredits.map((c) => (
              <div key={`${c.role}-${c.name}`} className="grid grid-cols-[minmax(8rem,1fr)_2fr] gap-4">
                <dt className="text-label text-graphite">{c.role}</dt>
                <dd>
                  {c.url ? (
                    <a href={c.url} className="link-quiet" target="_blank" rel="noopener noreferrer">
                      {c.name}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    c.name
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
