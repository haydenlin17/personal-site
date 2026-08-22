import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import Link from "next/link";
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

export default function ProfilePage() {
  return (
    <>
      <Hero />

      <Section id="about" label="About" title="Who I am">
        <div className="max-w-2xl space-y-5">
          {about.paragraphs.map((p) => (
            <p key={p.slice(0, 24)} className="text-[16px] leading-[1.75] text-ink-soft">
              {p}
            </p>
          ))}
        </div>
      </Section>

      <Section
        id="experience"
        label="Experience"
        title="What I do"
        lead="Trading, operating, and research, run in parallel."
      >
        <ol className="space-y-12">
          {experience.map((job) => (
            <li key={job.org} className="relative border-l border-rule pl-6">
              <span
                aria-hidden
                className="absolute -left-[3.5px] top-[0.55rem] size-[7px] rounded-full bg-rule-strong"
              />
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="font-serif text-xl leading-snug font-semibold tracking-tight text-ink">
                  {job.org}
                </h3>
                <p className="tnum text-[13px] text-ink-muted">{job.period}</p>
              </div>
              <p className="mt-1.5 text-[14px] font-medium text-accent">{job.role}</p>
              <p className="mt-0.5 text-[13px] text-ink-muted">{job.location}</p>
              <ul className="mt-4 space-y-2.5">
                {job.bullets.map((b) => (
                  <li
                    key={b.slice(0, 24)}
                    className="relative pl-4 text-[15px] leading-[1.7] text-ink-soft before:absolute before:top-[0.7em] before:left-0 before:size-1 before:rounded-full before:bg-rule-strong"
                  >
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
      >
        <div className="space-y-5">
          {projects.map((p) => (
            <article
              key={p.title}
              className="rounded-lg border border-rule bg-surface p-6 transition hover:border-rule-strong sm:p-7"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <p className="eyebrow">{p.kind}</p>
                <p className="tnum text-[12px] text-ink-muted">{p.period}</p>
              </div>
              <h3 className="mt-2.5 font-serif text-xl leading-snug font-semibold tracking-tight text-ink">
                {p.title}
              </h3>
              <p className="mt-2.5 max-w-2xl text-[15px] leading-[1.7] text-ink-soft">{p.summary}</p>
              <ul className="mt-4 space-y-2.5">
                {p.bullets.map((b) => (
                  <li
                    key={b.slice(0, 24)}
                    className="relative pl-4 text-[15px] leading-[1.7] text-ink-soft before:absolute before:top-[0.7em] before:left-0 before:size-1 before:rounded-full before:bg-rule-strong"
                  >
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
                </a>
              ) : null}
              {p.metrics ? (
                <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-rule pt-5 sm:grid-cols-3">
                  {p.metrics.map((m) => (
                    <div key={m.label}>
                      <dt className="eyebrow">{m.label}</dt>
                      <dd className="tnum mt-1 font-serif text-xl font-semibold text-ink">
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

      <Section id="education" label="Education" title="School">
        <div className="rounded-lg border border-rule bg-surface p-6 sm:p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 className="font-serif text-xl font-semibold tracking-tight text-ink">
              {education.school}
            </h3>
            <p className="tnum text-[13px] text-ink-muted">{education.period}</p>
          </div>
          <p className="mt-1.5 text-[14px] font-medium text-accent">{education.degree}</p>
          <p className="mt-0.5 text-[13px] text-ink-muted">{education.location}</p>

          <dl className="mt-6 grid grid-cols-1 gap-x-10 gap-y-5 border-t border-rule pt-5 sm:grid-cols-2">
            <div>
              <dt className="eyebrow">Standing</dt>
              <dd className="mt-1 text-[15px] text-ink-soft">{education.standing}</dd>
            </div>
            <div>
              <dt className="eyebrow">GPA</dt>
              <dd className="tnum mt-1 text-[15px] text-ink-soft">{education.gpa}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="eyebrow">Coursework</dt>
              <dd className="mt-1 text-[15px] leading-relaxed text-ink-soft">
                {education.coursework.join(", ")}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="eyebrow">Involvement</dt>
              <dd className="mt-2">
                <ul className="flex flex-col gap-1.5">
                  {education.involvement.map((club) => (
                    <li key={club.org} className="text-[15px] leading-relaxed text-ink-soft">
                      {club.org}
                      <span className="ml-2 text-[13px] text-ink-muted">{club.role}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-4 rounded-lg border border-rule px-6 py-5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <p className="font-serif text-[15px] font-semibold text-ink">
              {education.priorSchool.name}
            </p>
            <p className="tnum text-[13px] text-ink-muted">{education.priorSchool.period}</p>
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
            {education.priorSchool.detail.map((item) => (
              <li
                key={item}
                className="relative pl-4 text-[14px] text-ink-soft before:absolute before:top-[0.62em] before:left-0 before:size-1 before:rounded-full before:bg-rule-strong"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="skills" label="Skills" title="Tools and capabilities">
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {skillGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-[14px] font-semibold text-ink">{group.title}</h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-rule bg-surface px-3 py-1 text-[13px] text-ink-soft"
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
      </Section>

    </>
  );
}

function Hero() {
  // Checked at build time so the layout simply has no portrait column until the
  // file is dropped in, rather than shipping a broken image in the meantime.
  const portrait = existsSync(join(process.cwd(), "public", PORTRAIT)) ? `/${PORTRAIT}` : null;

  return (
    <section className="mx-auto max-w-6xl px-5 pt-14 pb-12 sm:px-8 sm:pt-24 sm:pb-16">
      <div className="flex flex-col-reverse gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-14">
        <div className="min-w-0 flex-1">
          <p className="eyebrow">{person.role}</p>
          <h1
            className="mt-4 font-serif text-[clamp(2.75rem,9vw,5.25rem)] leading-[0.95] font-semibold tracking-[-0.03em] text-ink"
          >
            {person.name}
          </h1>
          <p
            className="mt-6 max-w-2xl text-[17px] leading-[1.7] text-ink-soft"
          >
            {person.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
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
            width={440}
            height={550}
            priority
            className="w-[112px] shrink-0 rounded-lg border border-rule object-cover object-[50%_28%] sm:w-[132px] lg:w-[208px]"
            style={{ aspectRatio: "4 / 5" }}
          />
        ) : null}
      </div>

      <dl
        className="mt-14 grid grid-cols-2 border-t border-rule sm:grid-cols-4"
      >
        {quickFacts.map((fact) => (
          <div key={fact.label} className="border-b border-rule py-5 pr-6 sm:border-b-0">
            <dt className="eyebrow">{fact.label}</dt>
            <dd className="mt-1.5 font-serif text-[17px] leading-snug font-semibold text-ink">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      <dl
        className="grid grid-cols-2 border-t border-rule sm:grid-cols-4"
      >
        {trackRecord.map((stat) => (
          <div key={stat.label} className="border-b border-rule py-5 pr-6 sm:border-b-0">
            <dd className="tnum font-serif text-[clamp(1.5rem,3.5vw,2rem)] leading-none font-semibold tracking-tight text-ink">
              {stat.value}
            </dd>
            <dt className="eyebrow mt-2">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </section>
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
      <span className="text-ink-muted transition group-hover:text-accent">{icon}</span>
      {children}
    </a>
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
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
      <path strokeLinecap="round" strokeLinejoin="round" d="m3.5 7.5 7.4 5.2a2 2 0 0 0 2.2 0l7.4-5.2" />
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
