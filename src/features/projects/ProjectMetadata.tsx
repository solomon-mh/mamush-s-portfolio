import Link from "next/link";
import type { ReactNode } from "react";
import type { DisciplineRef } from "@/content";
import { hrefFor } from "@/lib/routes";

interface MetadataProps {
  client?: string | null;
  year?: number | null;
  role?: string | null;
  duration?: string | null;
  disciplines?: DisciplineRef[] | null;
}

/** Project facts as a horizontal definition list: scannable for art directors, meaningful to screen readers. */
export function ProjectMetadata({ client, year, role, duration, disciplines }: MetadataProps) {
  const rows: Array<{ term: string; value: ReactNode }> = [];
  if (disciplines?.length) {
    rows.push({
      term: disciplines.length > 1 ? "Disciplines" : "Discipline",
      value: disciplines.map((d, i) => (
        <span key={d._id}>
          {i > 0 && ", "}
          <Link href={hrefFor("discipline", d.slug)!} className="link-quiet">
            {d.title}
          </Link>
        </span>
      )),
    });
  }
  if (client) rows.push({ term: "Client", value: client });
  if (year) rows.push({ term: "Year", value: year });
  if (role) rows.push({ term: "Role", value: role });
  if (duration) rows.push({ term: "Running time", value: duration });
  if (rows.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-5 border-y border-rule py-6 sm:grid-cols-3 lg:grid-cols-5">
      {rows.map((row) => (
        <div key={row.term}>
          <dt className="text-label text-graphite">{row.term}</dt>
          <dd className="mt-1">{row.value}</dd>
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
    <div className="grid gap-10 sm:grid-cols-2">
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
            <div key={`${c.role}-${c.name}`} className="grid grid-cols-[minmax(7rem,1fr)_2.5fr] gap-4 border-t border-rule pt-3">
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
  );
}
