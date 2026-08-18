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
} from "@/lib/content";

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
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="work"
        label="Work"
        title="Selected work"
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

          <dl className="mt-6 grid grid-cols-1 gap-5 border-t border-rule pt-5 sm:grid-cols-2">
            <div>
              <dt className="eyebrow">Standing</dt>
              <dd className="mt-1 text-[15px] text-ink-soft">{education.standing}</dd>
            </div>
            <div>
              <dt className="eyebrow">GPA</dt>
              <dd className="tnum mt-1 text-[15px] text-ink-soft">{education.gpa}</dd>
            </div>
            <div>
              <dt className="eyebrow">Coursework</dt>
              <dd className="mt-1 text-[15px] leading-relaxed text-ink-soft">
                {education.coursework.join(", ")}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Involvement</dt>
              <dd className="mt-1 text-[15px] leading-relaxed text-ink-soft">
                {education.involvement.join(", ")}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 rounded-lg border border-rule px-6 py-4">
          <p className="font-serif text-[15px] font-semibold text-ink">
            {education.priorSchool.name}
          </p>
          <p className="tnum text-[13px] text-ink-muted">{education.priorSchool.period}</p>
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

      <Section id="contact" label="Contact" title="Get in touch">
        <div className="max-w-2xl">
          <p className="text-[16px] leading-[1.75] text-ink-soft">
            I am always open to talk about markets, research, or anything being built from scratch.
            The fastest way to reach me is email.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={`mailto:${person.email}`}
              className="rounded-full bg-accent px-5 py-2.5 text-[14px] font-medium text-paper transition hover:bg-accent-soft"
            >
              {person.email}
            </a>
            <a
              href={person.linkedin}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-rule-strong px-5 py-2.5 text-[14px] font-medium text-ink transition hover:border-ink hover:bg-sunk"
            >
              LinkedIn
            </a>
            <a
              href={person.resume}
              download="Hayden-Lin-Resume.pdf"
              className="rounded-full border border-rule-strong px-5 py-2.5 text-[14px] font-medium text-ink transition hover:border-ink hover:bg-sunk"
            >
              Download resume
            </a>
          </div>
          <p className="mt-6 text-[13px] text-ink-muted">
            Based in {person.location}, open to roles across the {person.region}.
          </p>
        </div>
      </Section>
    </>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-14 pb-12 sm:px-8 sm:pt-24 sm:pb-16">
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
      <div
        className="rise mt-9 grid max-w-2xl gap-3 sm:grid-cols-2"
        style={{ animationDelay: "180ms" }}
      >
        <ActionCard
          href={person.resume}
          download="Hayden-Lin-Resume.pdf"
          title="Download resume"
          detail="PDF, one page, 120 KB"
          icon={<DownloadIcon />}
        />
        <ActionCard
          href={`mailto:${person.email}`}
          title="Send me an email"
          detail={person.email}
          icon={<MailIcon />}
        />
      </div>

      <dl className="rise mt-14 grid grid-cols-2 border-t border-rule sm:grid-cols-4" style={{ animationDelay: "240ms" }}>
        {quickFacts.map((fact) => (
          <div key={fact.label} className="border-b border-rule py-5 pr-6 sm:border-b-0">
            <dt className="eyebrow">{fact.label}</dt>
            <dd className="mt-1.5 font-serif text-[17px] leading-snug font-semibold text-ink">
              {fact.value}
            </dd>
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

/**
 * The two things a visitor is most likely to want, said plainly. A pill reading
 * "Resume" leaves them guessing whether it opens, downloads, or scrolls; this
 * says which, and what they are getting.
 */
function ActionCard({
  href,
  title,
  detail,
  icon,
  download,
}: {
  href: string;
  title: string;
  detail: string;
  icon: React.ReactNode;
  download?: string;
}) {
  return (
    <a
      href={href}
      download={download}
      className="group flex items-center gap-4 rounded-lg border border-rule bg-surface px-4 py-4 transition hover:border-accent hover:bg-sunk"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-rule bg-paper text-accent transition group-hover:border-accent">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-ink">{title}</span>
        <span className="mt-0.5 block truncate text-[13px] text-ink-muted">{detail}</span>
      </span>
      <svg
        viewBox="0 0 24 24"
        className="size-4 shrink-0 text-ink-muted transition group-hover:translate-x-0.5 group-hover:text-accent"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </a>
  );
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v11m0 0 4-4m-4 4-4-4" />
      <path strokeLinecap="round" d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
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
