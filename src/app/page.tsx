import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import Link from "next/link";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Section } from "@/components/section";
import {
  about,
  credentials,
  education,
  experience,
  honors,
  languages,
  person,
  platforms,
  projects,
  quickFacts,
  skillGroups,
  trackRecord,
} from "@/lib/content";

/** Drop a square portrait here and it appears; leave it out and the hero adapts. */
const PORTRAIT = "headshot.jpg";

/**
 * One treatment for every block on the page: a rule down the left edge. Quieter
 * than a filled panel, and it keeps the page reading as a document rather than
 * a stack of widgets.
 */
const RAIL = "border-l border-rule pl-6 sm:pl-7";

/** Bulleted line, shared by every list of points on the page. */
const BULLET =
  "relative pl-4 text-[15px] leading-[1.7] text-ink-soft before:absolute before:top-[0.7em] before:left-0 before:size-1 before:rounded-full before:bg-rule-strong";

export default function ProfilePage() {
  return (
    <>
      <ScrollToTop />
      <Hero />

      <Section id="about" label="About" title="Who I am" index={1}>
        <div className={RAIL}>
          <div className="max-w-2xl space-y-5">
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="text-[15px] leading-[1.75] text-ink-soft">
                {p}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <Section
        id="experience"
        label="Experience"
        title="What I do"
        lead="Trading, operating, and research, run in parallel."
        index={2}
      >
        <ol className="space-y-10">
          {experience.map((job) => (
            <li key={job.org} className={RAIL}>
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
                <div className="flex items-center gap-3">
                  <Logo name={job.logo} alt={`${job.org} logo`} />
                  <h3 className="font-serif text-xl leading-snug font-semibold tracking-tight text-ink">
                    {job.org}
                  </h3>
                </div>
                <p className="tnum text-[13px] text-ink-muted">{job.period}</p>
              </div>
              <p className="mt-1.5 text-[14px] font-medium text-accent">{job.role}</p>
              <p className="mt-0.5 text-[13px] text-ink-muted">{job.location}</p>
              <ul className="mt-4 space-y-2.5">
                {job.bullets.map((b) => (
                  <li key={b.slice(0, 24)} className={BULLET}>
                    {b}
                  </li>
                ))}
              </ul>
              {job.href ? (
                <Link
                  href={job.href}
                  className="group mt-5 inline-flex items-center gap-1.5 text-[14px] font-medium text-accent transition hover:text-accent-soft"
                >
                  {job.hrefLabel ?? "Open"}
                  <Arrow />
                </Link>
              ) : null}
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="work"
        label="Work"
        title="Projects"
        lead="Research, systems, and products built end to end."
        index={3}
      >
        <div className="space-y-10">
          {projects.map((p) => (
            <article key={p.title} className={RAIL}>
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
                <div className="flex items-center gap-3">
                  <Logo name={p.logo} alt={`${p.title} logo`} />
                  <h3 className="font-serif text-xl leading-snug font-semibold tracking-tight text-ink">
                    {p.title}
                  </h3>
                </div>
                <p className="tnum text-[13px] text-ink-muted">{p.period}</p>
              </div>
              <p className="mt-1.5 text-[14px] font-medium text-accent">{p.kind}</p>
              <p className="mt-3 max-w-2xl text-[15px] leading-[1.7] text-ink-soft">{p.summary}</p>
              <ul className="mt-4 space-y-2.5">
                {p.bullets.map((b) => (
                  <li key={b.slice(0, 24)} className={BULLET}>
                    {b}
                  </li>
                ))}
              </ul>
              {p.href ? (
                <a
                  href={p.href}
                  target={p.href.startsWith("http") ? "_blank" : undefined}
                  rel={p.href.startsWith("http") ? "noreferrer" : undefined}
                  className="group mt-5 inline-flex items-center gap-1.5 text-[14px] font-medium text-accent transition hover:text-accent-soft"
                >
                  {p.hrefLabel ?? "Open"}
                  <Arrow />
                </a>
              ) : null}
              {p.metrics ? (
                <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-rule pt-5 sm:grid-cols-3">
                  {p.metrics.map((m) => (
                    <div key={m.label}>
                      <dt className="eyebrow">{m.label}</dt>
                      <dd className="tnum mt-1 font-serif text-[20px] font-semibold text-ink">
                        {m.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </article>
          ))}
        </div>
      </Section>

      <Section id="education" label="Education" title="School" index={4}>
        <div className="space-y-10">
          <SchoolCard
            name={education.school}
            logo={education.logo}
            period={education.period}
            role={education.degree}
            location={education.location}
            facts={[
              { label: "Standing", value: education.standing },
              { label: "GPA", value: education.gpa },
              { label: "Coursework", value: education.coursework.join(", ") },
              {
                label: "Involvement",
                value: education.involvement.map((c) => `${c.org} (${c.role})`).join(", "),
              },
            ]}
          />
          <SchoolCard
            name={education.priorSchool.name}
            logo={education.priorSchool.logo}
            period={education.priorSchool.period}
            facts={[...education.priorSchool.facts]}
            columns={3}
          />
        </div>
      </Section>

      <Section id="skills" label="Skills" title="Tools and capabilities" index={5}>
        <div className={RAIL}>
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {skillGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-[14px] font-semibold text-ink">{group.title}</h3>
                <ul className="mt-3 columns-2 gap-x-8 space-y-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="relative break-inside-avoid pl-4 text-[14px] leading-relaxed text-ink-soft before:absolute before:top-[0.62em] before:left-0 before:size-1 before:rounded-full before:bg-rule-strong"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-x-10 gap-y-8 border-t border-rule pt-8 sm:grid-cols-2">
            <ListBlock title="Platforms" items={[...platforms]} />
            <ListBlock title="Credentials" items={[...credentials]} />
            <ListBlock title="Honors and awards" items={[...honors]} />
            <ListBlock title="Languages" items={[...languages]} />
          </div>
        </div>
      </Section>
    </>
  );
}

/**
 * Marks sit outside the rule, so a row reads as "logo, then the entry" rather
 * than the logo being another item inside the text column.
 */
function Logo({ name, alt }: { name?: string; alt: string }) {
  if (!name) return null;
  return (
    <Image
      src={`/logos/${name}.png`}
      alt={alt}
      width={96}
      height={96}
      // A few KB each and mostly near the top: waiting on an intersection to
      // fetch them only risks the marks popping in after the text.
      loading="eager"
      className="size-8 shrink-0 object-contain"
    />
  );
}

function Hero() {
  // Checked at build time so the layout simply has no portrait column until the
  // file is dropped in, rather than shipping a broken image in the meantime.
  const portrait = existsSync(join(process.cwd(), "public", PORTRAIT)) ? `/${PORTRAIT}` : null;

  return (
    <section className="mx-auto max-w-6xl px-5 pt-14 pb-12 sm:px-8 sm:pt-24 sm:pb-16">
      <div className="flex flex-col-reverse gap-7 lg:flex-row lg:items-start lg:gap-14">
        <div className="min-w-0 flex-1">
          <p className="eyebrow rise">{person.role}</p>
          <h1
            className="rise mt-4 font-serif text-[clamp(2.75rem,9vw,5.25rem)] leading-[0.95] font-semibold tracking-[-0.03em] text-ink"
            style={{ animationDelay: "60ms" }}
          >
            {person.name}
          </h1>
          <p
            className="rise mt-6 max-w-2xl text-[17px] leading-[1.7] text-ink-soft"
            style={{ animationDelay: "120ms" }}
          >
            {person.intro}
          </p>
          <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "180ms" }}>
            <ActionButton
              href={person.resume}
              download="Hayden-Lin-Resume.pdf"
              icon={<DocumentIcon />}
            >
              Resume
            </ActionButton>
            <ActionButton href={`mailto:${person.email}`} icon={<MailIcon />}>
              Contact
            </ActionButton>
            <ActionButton href={person.linkedin} external icon={<LinkedInIcon />}>
              LinkedIn
            </ActionButton>
          </div>
        </div>

        {portrait ? (
          <Image
            src={portrait}
            alt={`${person.name}, portrait`}
            width={640}
            height={640}
            priority
            className="rise size-[148px] shrink-0 rounded-lg border border-rule object-cover sm:size-[188px] lg:size-[320px]"
            style={{ animationDelay: "60ms" }}
          />
        ) : null}
      </div>

      {/* Both strips carry the same weight of information, so they render at the
          same size. One of them being twice the other read as a mistake. */}
      <dl
        className="rise mt-14 grid grid-cols-2 border-t border-rule sm:grid-cols-4"
        style={{ animationDelay: "240ms" }}
      >
        {quickFacts.map((fact) => (
          <div key={fact.label} className="border-b border-rule py-5 pr-6 sm:border-b-0">
            <dt className="eyebrow">{fact.label}</dt>
            <dd className="mt-1.5 font-serif text-[20px] leading-snug font-semibold text-ink">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      <dl
        className="rise grid grid-cols-2 border-t border-rule sm:grid-cols-4"
        style={{ animationDelay: "300ms" }}
      >
        {trackRecord.map((stat) => (
          <div key={stat.label} className="border-b border-rule py-5 pr-6 sm:border-b-0">
            <dd className="tnum font-serif text-[20px] leading-snug font-semibold text-ink">
              {stat.value}
            </dd>
            <dt className="eyebrow mt-1.5">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Both schools render through this, so neither can drift from the other. */
function SchoolCard({
  name,
  period,
  role,
  location,
  facts,
  logo,
  columns = 2,
}: {
  name: string;
  period: string;
  role?: string;
  location?: string;
  facts: { label: string; value: string }[];
  logo?: string;
  /** Number of fact columns, so a short list can sit on one line. */
  columns?: 2 | 3;
}) {
  return (
    <div className={RAIL}>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
        <div className="flex items-center gap-3">
          <Logo name={logo} alt={`${name} logo`} />
          <h3 className="font-serif text-xl leading-snug font-semibold tracking-tight text-ink">
            {name}
          </h3>
        </div>
        <p className="tnum text-[13px] text-ink-muted">{period}</p>
      </div>
      {role ? <p className="mt-1.5 text-[14px] font-medium text-accent">{role}</p> : null}
      {location ? <p className="mt-0.5 text-[13px] text-ink-muted">{location}</p> : null}
      <dl
        className={`mt-6 grid grid-cols-1 gap-x-10 gap-y-5 border-t border-rule pt-5 ${
          columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
        }`}
      >
        {facts.map((f) => (
          <div key={f.label}>
            <dt className="eyebrow">{f.label}</dt>
            <dd className="mt-1 text-[15px] leading-relaxed text-ink-soft">{f.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-[14px] font-semibold text-ink">{title}</h3>
      <ul className="mt-3 space-y-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="relative pl-4 text-[14px] leading-relaxed text-ink-soft before:absolute before:top-[0.62em] before:left-0 before:size-1 before:rounded-full before:bg-rule-strong"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ActionButton({
  href,
  children,
  icon,
  download,
  external,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  download?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      download={download}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="inline-flex items-center gap-2.5 rounded-lg border border-rule-strong px-5 py-3 text-[15px] font-medium text-ink transition hover:border-accent hover:bg-sunk"
    >
      <span className="text-ink-muted">{icon}</span>
      {children}
    </a>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-3.5 transition group-hover:translate-x-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5M9 13h6M9 17h4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m3.5 7.5 7.4 5.2a2 2 0 0 0 2.2 0l7.4-5.2"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[17px]" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4v11H3v-11Zm6.5 0h3.8v1.5h.06a4.2 4.2 0 0 1 3.77-2c4 0 4.75 2.6 4.75 6v5.5h-4V16c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1v4.6h-4v-11Z" />
    </svg>
  );
}
