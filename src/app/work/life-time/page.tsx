import type { Metadata } from "next";
import Link from "next/link";
import { comps, financials, memo, questions, sections, sources, type Row } from "@/lib/life-time";
import { person } from "@/lib/content";

export const metadata: Metadata = {
  title: `${memo.company} (${memo.ticker})`,
  description: `Equity research memo on ${memo.company}, ${memo.ticker}. ${memo.thesis}`,
};

export default function LifeTimeMemo() {
  return (
    <article className="mx-auto max-w-3xl px-5 pt-12 pb-4 sm:px-8 sm:pt-16">
      <Link
        href="/#work"
        className="group inline-flex items-center gap-1.5 text-[13px] text-ink-muted transition hover:text-ink"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-3.5 transition group-hover:-translate-x-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
        Selected work
      </Link>

      <header className="mt-8 border-b border-rule pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <p className="eyebrow">Equity Research</p>
          <span className="rounded-full border border-accent px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-accent uppercase">
            {memo.recommendation}
          </span>
        </div>
        <h1 className="mt-3 font-serif text-[clamp(2rem,6vw,3rem)] leading-[1.05] font-semibold tracking-[-0.02em] text-ink">
          {memo.company}
        </h1>
        <p className="tnum mt-2 text-[15px] font-medium text-accent">{memo.ticker}</p>
        <p className="mt-4 text-[13px] text-ink-muted">
          {person.name}
          <span className="mx-2 text-rule-strong">/</span>
          {memo.date}
          <span className="mx-2 text-rule-strong">/</span>
          {memo.context}
        </p>

        <dl className="mt-7 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {memo.facts.map((f) => (
            <div key={f.label}>
              <dt className="eyebrow">{f.label}</dt>
              <dd className="tnum mt-1 font-serif text-[17px] font-semibold text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <p className="mt-8 border-l-2 border-accent pl-5 font-serif text-[19px] leading-[1.6] text-ink italic">
        {memo.thesis}
      </p>

      {sections.map((section) => (
        <section key={section.heading} className="mt-10">
          <h2 className="font-serif text-[22px] leading-snug font-semibold tracking-tight text-ink">
            {section.heading}
          </h2>
          {section.paragraphs.map((p) => (
            <p key={p.slice(0, 24)} className="mt-4 text-[16px] leading-[1.75] text-ink-soft">
              {p}
            </p>
          ))}
        </section>
      ))}

      <Table heading={financials.heading} columns={financials.columns} rows={financials.rows} />
      <Table heading={comps.heading} columns={comps.columns} rows={comps.rows} note={comps.note} />

      <section className="mt-12">
        <h2 className="font-serif text-[22px] leading-snug font-semibold tracking-tight text-ink">
          Anticipated questions
        </h2>
        <dl className="mt-5 space-y-6">
          {questions.map((item) => (
            <div key={item.q} className="rounded-lg border border-rule bg-surface p-5 sm:p-6">
              <dt className="font-serif text-[17px] font-semibold text-ink">{item.q}</dt>
              <dd className="mt-2.5 text-[15px] leading-[1.7] text-ink-soft">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12 border-t border-rule pt-6">
        <p className="eyebrow">Sources</p>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{sources.join(", ")}</p>
        <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">
          Figures are as of the date above and have not been restated since. This is a student
          write up, not investment advice.
        </p>
      </section>
    </article>
  );
}

function Table({
  heading,
  columns,
  rows,
  note,
}: {
  heading: string;
  columns: readonly string[];
  rows: Row[];
  note?: string;
}) {
  return (
    <section className="mt-12">
      <h2 className="font-serif text-[22px] leading-snug font-semibold tracking-tight text-ink">
        {heading}
      </h2>
      {/* Wide tables scroll inside their own box so the page never does. */}
      <div className="mt-5 overflow-x-auto rounded-lg border border-rule">
        <table className="w-full min-w-[30rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-rule bg-sunk">
              <th className="eyebrow px-4 py-3 font-semibold">Metric</th>
              {columns.map((c) => (
                <th key={c} className="eyebrow px-4 py-3 font-semibold">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-rule last:border-b-0">
                <th scope="row" className="px-4 py-2.5 text-[14px] font-medium text-ink-soft">
                  {row.label}
                </th>
                {row.values.map((v, i) => (
                  <td
                    key={`${row.label}-${columns[i]}`}
                    className="tnum px-4 py-2.5 text-[14px] font-medium text-ink"
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note ? <p className="mt-4 text-[15px] leading-[1.7] text-ink-soft">{note}</p> : null}
    </section>
  );
}
