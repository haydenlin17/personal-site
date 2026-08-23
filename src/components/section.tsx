import type { ReactNode } from "react";

/**
 * Every section on the profile page shares one shape: a sticky label in a
 * narrow left column, the content in a wide right column. On small screens the
 * two stack and the label becomes a plain heading.
 */
export function Section({
  id,
  label,
  title,
  lead,
  children,
  index = 0,
}: {
  id: string;
  label: string;
  title?: string;
  lead?: string;
  children: ReactNode;
  /** Position in the page, used only to stagger the entrance. */
  index?: number;
}) {
  return (
    <section
      id={id}
      className="rise border-t border-rule py-16 sm:py-20"
      // Every section animates, so nothing sits finished in frame while
      // something above it is still arriving. Capped so the last one is not
      // waiting seconds to appear.
      style={{ animationDelay: `${Math.min(index, 6) * 90 + 300}ms` }}
    >
      <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">{label}</p>
          {title ? (
            <h2 className="mt-2 font-serif text-2xl leading-tight font-semibold tracking-tight text-ink">
              {title}
            </h2>
          ) : null}
          {lead ? <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">{lead}</p> : null}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}
