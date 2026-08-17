/**
 * Every word of page copy lives here, merged from two resumes and the LinkedIn
 * export. Edit this file to update the site; the components only lay it out.
 *
 * Where the two resumes worded the same bullet differently, the stronger
 * phrasing was kept. Where they disagreed on a date (LinkedIn puts trading at
 * October 2024, both resumes say November) the resume wins.
 */

export const person = {
  name: "Hayden Lin",
  /** Sits above the name in the hero. */
  role: "Finance Student",
  headline: "Markets, equity research, and fintech",
  location: "Millburn, NJ",
  region: "New York City Metropolitan Area",
  email: "haydenjlin@gmail.com",
  linkedin: "https://www.linkedin.com/in/hayden-lin",
  linkedinLabel: "linkedin.com/in/hayden-lin",
  /** Served from public/. The high finance version is the default. */
  resume: "/Hayden-Lin-Resume.pdf",
  intro:
    "Sophomore at Rutgers Business School studying finance. I trade equity options and futures, research public equities, and run a YouTube content agency that scaled to a peak of 120 million monthly views.",
} as const;

/** The four facts under the hero, in render order. */
export const quickFacts = [
  { label: "School", value: "Rutgers Business School" },
  { label: "Degree", value: "Finance, B.S." },
  { label: "Class", value: "2029" },
  { label: "GPA", value: "3.96" },
] as const;

export const about = {
  heading: "Who I am",
  paragraphs: [
    "For the past two years I have built projects at the intersection of financial markets, technology, and entrepreneurship. Most of what I know came from running something real and watching the numbers tell me whether it worked.",
    "I founded and operate a YouTube content agency that reached a peak of 120 million monthly views. I manage 11 paid editors across seven active channels, oversee production of roughly 150 short form videos a month, and use audience retention data to drive content strategy, operations, and growth decisions.",
    "On the markets side I trade equity options and run futures prop firm evaluations using order flow, volume profile, and footprint analysis. More recently I used Claude Code to build and backtest a systematic futures order flow engine across more than 200 trading days of tick data.",
    "I am looking for opportunities in financial markets, equity research, fintech, and startup environments where I can contribute through analytical thinking, technical problem solving, and hands on execution. Always open to connect.",
  ],
} as const;

export type Experience = {
  org: string;
  role: string;
  location: string;
  period: string;
  bullets: string[];
};

export const experience: Experience[] = [
  {
    org: "Independent Trader",
    role: "Equity Options and Futures",
    location: "Millburn, NJ",
    period: "November 2024 to Present",
    bullets: [
      "Generated a 30% realized, net of commission YTD return in 2026 on a $10K independently managed account through rules based equity options swing trades and disciplined exits.",
      "Trade futures in prop firm evaluations using volume profile, footprint charts, delta, and order flow signals while maintaining a detailed journal of entries, exits, and execution errors.",
      "Built a multi timeframe futures order flow engine that processed 235M ticks across 213 trading days, then backtested it to a 64% win rate and a 1.84 profit factor.",
    ],
  },
  {
    org: "YouTube Content Agency",
    role: "Founder and Executive Director",
    location: "Millburn, NJ",
    period: "June 2024 to Present",
    bullets: [
      "Scaled a solo media operation from 2M to a peak of 120M monthly views within six months and launched approximately 10 channels across multiple content niches.",
      "Maintain seven active channels and direct production of roughly 150 short form videos per month through standardized scripting, editing, quality control, and publishing workflows.",
      "Lead 11 paid editors and approximately 15 total team members past and present, overseeing hiring, training, performance reviews, workload allocation, and production deadlines.",
      "Generated five figure revenue and built a 2,000 member Discord community by applying retention analytics, creator partnerships, and channel level performance data to growth decisions.",
    ],
  },
  {
    org: "Rutgers Department of Finance",
    role: "Undergraduate Research Assistant, Professor Alex Van Zant",
    location: "New Brunswick, NJ",
    period: "June 2026 to Present",
    bullets: [
      "Conduct research under Professor Alex Van Zant, whose scholarship bridges business management and psychology, with emphasis on social judgment, moral self perception, and organizational behavior.",
      "Analyze and peer review interdisciplinary research examining why individuals perceive themselves as comparatively more moral, or less immoral, than others.",
      "Evaluate theoretical framing, research methodology, supporting evidence, and conclusions to prepare structured discussion points for continued faculty research.",
    ],
  },
];

export type Project = {
  title: string;
  kind: string;
  period: string;
  summary: string;
  bullets: string[];
  /** Rendered as a small metric strip at the bottom of the card. */
  metrics?: { label: string; value: string }[];
  href?: string;
  hrefLabel?: string;
};

export const projects: Project[] = [
  {
    title: "Life Time Group Holdings (NYSE: LTH)",
    kind: "Equity Research",
    period: "April 2026",
    summary:
      "An independent long pitch delivered through the Rutgers Road to Wall Street program, built from FY2023 to FY2025 filings and investor materials.",
    bullets: [
      "Identified 14.5% revenue growth to $3.00B, 139% net income growth to $374M, and margin expansion from 6% to 12%.",
      "Developed a long thesis around premium member pricing power, recurring revenue, rising revenue per member, and continued expansion into affluent suburban markets.",
      "Delivered a verbal pitch covering thesis, valuation, catalysts, competitive positioning, and macro risk, highlighting a 16.8x trailing P/E, a $500M repurchase authorization, roughly 15% insider ownership, and 12 to 14 planned annual club openings.",
    ],
    metrics: [
      { label: "Revenue", value: "$3.00B" },
      { label: "Net income growth", value: "139%" },
      { label: "Trailing P/E", value: "16.8x" },
    ],
  },
  {
    title: "Futures Order Flow Engine",
    kind: "Quantitative Research",
    period: "2026",
    summary:
      "A multi timeframe order flow engine built with Claude Code to test whether a discretionary futures model holds up against a decade of tick data.",
    bullets: [
      "Processed 235M ticks across 213 trading days and 240 plus focused market hours, identifying 620 valid setups.",
      "Backtested 89 simulated trades with a 64% win rate, a 1.84 profit factor, and a 1.8R average winner.",
      "Encoded volume profile, footprint, and delta signals into reproducible rules so results can be re-run rather than remembered.",
    ],
    metrics: [
      { label: "Ticks processed", value: "235M" },
      { label: "Win rate", value: "64%" },
      { label: "Profit factor", value: "1.84" },
    ],
  },
  {
    title: "Forge",
    kind: "AI Fitness App",
    period: "June 2026 to Present",
    summary:
      "A closed beta fitness application that puts calorie and macro logging, workout planning, workout tracking, and weight tracking in one product.",
    bullets: [
      "Built and deployed across approximately 20 synced accounts, with diet, workout, and weight data centralized for ongoing tracking.",
      "Engineered Gemini API powered meal logging that processed approximately 500 food entries, roughly 70% of them submitted through photo based tracking rather than natural language or manual entry.",
      "Shipped 50 plus product updates and Vercel deployments, iterating on onboarding, usability, data flows, and application logic from friends and family feedback.",
    ],
    metrics: [
      { label: "Beta accounts", value: "~20" },
      { label: "Food entries", value: "~500" },
      { label: "Releases", value: "50+" },
    ],
  },
];

export const education = {
  school: "Rutgers Business School",
  location: "New Brunswick, NJ",
  degree: "Bachelor of Science, Finance",
  period: "September 2025 to May 2029",
  standing: "Sophomore, 69 credits",
  gpa: "3.96, Dean's List every semester",
  coursework: [
    "Financial Accounting",
    "Macroeconomics",
    "Microeconomics",
    "Supply Chain Management",
    "Marketing",
    "Management",
  ],
  involvement: ["Little Investment Bankers at Rutgers", "Ascend New Brunswick"],
  priorSchool: { name: "Millburn High School", period: "2021 to 2025" },
} as const;

export const skillGroups = [
  {
    title: "Markets and Trading",
    items: [
      "Financial Markets",
      "Options and Futures Trading",
      "Technical Analysis",
      "Volume Profile",
      "Footprint Charts",
      "Order Flow Analysis",
      "Backtesting",
      "Risk Management",
    ],
  },
  {
    title: "Investment Research and Analytics",
    items: [
      "Equity Research",
      "Financial Statement Analysis",
      "Equity Valuation",
      "Comparable Company Analysis",
      "Catalyst Analysis",
      "Financial Modeling",
      "Business Analytics",
      "Data Visualization",
    ],
  },
  {
    title: "Product, AI, and Automation",
    items: [
      "Claude Code",
      "Claude API",
      "Gemini API",
      "Ollama Models",
      "API Integration",
      "Vercel Deployment",
      "Closed Beta Testing",
      "Product Strategy",
    ],
  },
  {
    title: "Growth and Operations",
    items: [
      "Growth Strategy",
      "YouTube Analytics",
      "Content Operations",
      "Digital Marketing",
      "Community Management",
      "Buffer Automation",
      "CapCut",
      "DaVinci Resolve",
    ],
  },
] as const;

export const platforms = [
  "Webull",
  "Lucid Trading",
  "Rithmic",
  "MotiveWave",
  "TradingView",
  "Excel",
  "YouTube Studio",
  "Higgsfield",
] as const;

export const credentials = [
  "Bloomberg Market Concepts",
  "Bloomberg Finance Fundamentals",
  "CITI Research Certification",
  "Social, Behavioral, and Epidemiologic Research Investigators",
  "Excel Essential Training (Microsoft 365)",
  "AP Scholar With Distinction",
] as const;

export const honors = [
  "YouTube Silver Play Button",
  "Dean's List, all semesters",
  "4 Presidential Volunteer Service Awards (1 Gold, 3 Bronze)",
] as const;

export const languages = ["English (Native)", "Mandarin (Proficient)"] as const;

/** Order matters: this is the order the header renders them. */
export const sections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;
