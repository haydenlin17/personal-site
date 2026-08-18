import Link from "next/link";
import { person } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-[13px] text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          &copy; {new Date().getFullYear()} {person.name}
        </p>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a className="transition hover:text-ink" href={`mailto:${person.email}`}>
            Email
          </a>
          <a
            className="transition hover:text-ink"
            href={person.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a className="transition hover:text-ink" href={person.resume} download="Hayden-Lin-Resume.pdf">
            Resume
          </a>
          <Link className="transition hover:text-ink" href="/channels">
            Channels
          </Link>
        </nav>
      </div>
    </footer>
  );
}
