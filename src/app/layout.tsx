import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { person } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const display = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});


export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${person.name} | ${person.role}`,
    template: `%s | ${person.name}`,
  },
  description: person.intro,
  openGraph: {
    title: `${person.name} | ${person.role}`,
    description: person.intro,
    url: siteUrl,
    siteName: person.name,
    type: "profile",
  },
  twitter: { card: "summary", title: person.name, description: person.intro },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

/**
 * Runs before the first paint so a visitor who chose dark never sees a white
 * flash. Kept as a string because it has to be inline and synchronous; a
 * component or an external file would both land too late.
 */
const themeScript = `
(function () {
  try {
    // Going back to the profile should land on the name, not halfway down the
    // page where the reader happened to be before they opened Channels. The
    // site is short enough that restoring a scroll position costs more than it
    // gives, and the router scrolls new navigations to the top anyway.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    var stored = localStorage.getItem("theme");
    var dark = stored === "dark" || (!stored && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${display.variable} ${body.variable} min-h-dvh antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
