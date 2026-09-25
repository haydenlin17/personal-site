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

/**
 * The scale numbers, kept separate from `quickFacts` because they answer a
 * different question: those say who he is on paper, these say what he has run.
 */
export const trackRecord = [
  { value: "120M", label: "Peak monthly views" },
  { value: "540M+", label: "Lifetime views" },
  { value: "11", label: "Paid editors led" },
  { value: "2,000", label: "Discord community" },
] as const;

export const about = {
  heading: "Who I am",
  paragraphs: [
    "For the past two years I have built projects at the intersection of financial markets, technology, and entrepreneurship. Most of what I know came from running something real and watching the numbers tell me whether it worked.",
    "I founded and operate a YouTube content agency that reached a peak of 120 million monthly views. I manage 11 paid editors across seven active channels, oversee production of roughly 100 short form videos a month, and use audience retention data to drive content strategy, operations, and growth decisions.",
    "On the markets side I trade equity options and run futures prop firm evaluations using order flow, volume profile, and footprint analysis. More recently I ran an AI assisted Python simulation to backtest a discretionary order flow model on ES futures tick data across 121 trading days, and the version that held up out of sample produced 84 trades at a 1.94 profit factor.",
    "I am looking for opportunities in financial markets, equity research, fintech, and startup environments where I can contribute through analytical thinking, technical problem solving, and hands on execution. Always open to connect.",
  ],
} as const;

export type Experience = {
  org: string;
  role: string;
  location: string;
  period: string;
  bullets: string[];
  /** Optional link rendered under the bullets. */
  href?: string;
  hrefLabel?: string;
  /** File in public/logos, without the extension. */
  logo?: string;
};

export const experience: Experience[] = [
  {
    org: "AugCap LLC",
    logo: "augcap",
    role: "Investment Analyst Intern",
    location: "Remote",
    period: "September 2026 to Present",
    bullets: [
      "Built five year DCF models on three prospective financial firms the company is evaluating for investment: a neo investment bank, an AI native venture studio, and a private equity search fund.",
      "Projected each company's path from early operating losses to sustained EBITDA profitability by 2031, deriving unlevered free cash flow and identifying the year each business turns cash flow positive.",
      "Discounted cash flows using risk adjusted WACC and EBITDA exit multiples calibrated to each company's stage and risk profile, with high, base, and low case sensitivity across all three models.",
    ],
  },
  {
    org: "Independent Trader",
    role: "Futures Order Flow and Equity Options",
    location: "Millburn, NJ",
    period: "November 2024 to Present",
    bullets: [
      "Trade prop firm evaluations with an order flow model on index futures using the DOM, footprint charts, volume profile, and options flow, keeping a 150 plus entry journal of daily biases, entries, exits, and execution errors.",
      "Generated a 30% realized, net of commission YTD return in 2026 on a $10K independently managed account through equity options swing trades on large cap stocks, against a $2K maximum drawdown.",
      "Backtested a discretionary order flow model on ES futures tick data across 121 trading days using an AI assisted Python simulation; the version that held up out of sample produced 84 trades at a 1.94 profit factor.",
    ],
  },
  {
    org: "YouTube Content Agency",
    logo: "youtube",
    role: "Founder and Executive Director",
    location: "Millburn, NJ",
    period: "June 2024 to Present",
    bullets: [
      "Scaled a solo media operation from 2M to a peak of 120M monthly views within six months and launched approximately 10 channels across multiple content niches.",
      "Maintain seven active channels and direct production of roughly 100 short form videos per month through standardized scripting, editing, quality control, and publishing workflows.",
      "Lead 11 paid editors and approximately 15 total team members past and present, overseeing hiring, training, performance reviews, workload allocation, and production deadlines.",
      "Generated five figure revenue and built a 2,000 member Discord community by applying retention analytics, creator partnerships, and channel level performance data to growth decisions.",
    ],
    href: "/channels",
    hrefLabel: "See the live channel numbers",
  },
  {
    org: "Rutgers Department of Finance",
    logo: "rutgers",
    role: "Undergraduate Research Assistant, Professor Alex Van Zant",
    location: "New Brunswick, NJ",
    period: "June 2026 to Present",
    bullets: [
      "Conduct research under Professor Alex Van Zant, whose scholarship bridges business management and psychology, with emphasis on social judgment, moral self perception, and organizational behavior.",
      "Analyzed and peer reviewed three academic studies: why people perceive themselves as holier but less evil than others, why people comply with advice that presents a conflict of interest, and how deception breeds trust.",
      "Evaluated each study's theoretical framing, research methodology, supporting evidence, and conclusions to prepare structured discussion points for continued faculty research.",
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
  /** File in public/logos, without the extension. */
  logo?: string;
  /** Optional supporting image, rendered under the bullets. */
  media?: { src: string; alt: string; caption: string; width: number; height: number };
};

export const projects: Project[] = [
  {
    title: "Life Time Group Holdings (NYSE: LTH)",
    logo: "lifetime",
    kind: "Equity Research",
    period: "April 2026",
    summary:
      "An independent long pitch prepared for the Rutgers Road to Wall Street interview, built from FY2023 to FY2025 filings and investor materials.",
    href: "/work/life-time",
    hrefLabel: "Read the full memo",
    bullets: [
      "Identified 14.5% revenue growth to $3.00B, 139% net income growth to $374M, and margin expansion from 6% to 12%.",
      "Developed a long thesis around premium member pricing power, recurring revenue, rising revenue per member, and continued expansion into affluent suburban markets.",
      "Argued the discount against Planet Fitness, which trades near 28x earnings on half the revenue and slower earnings growth, and sized the gap at roughly 25% upside on a 22x multiple.",
      "Covered catalysts, competitive positioning, and macro risk, including a 16.8x trailing P/E, a $500M repurchase authorization, roughly 15% insider ownership, and 12 to 14 planned annual club openings.",
    ],
    metrics: [
      { label: "Revenue", value: "$3.00B" },
      { label: "Net income growth", value: "139%" },
      { label: "Trailing P/E", value: "16.8x" },
    ],
  },
  {
    title: "Order Flow Backtest",
    kind: "Quantitative Research",
    period: "2026",
    summary:
      "An AI assisted Python simulation built to test a discretionary order flow model against ES futures tick data and check whether the result held up outside the sample it was built on.",
    bullets: [
      "Backtested a discretionary order flow model on ES futures tick data across 121 trading days, run as an AI assisted Python simulation rather than software engineered by hand.",
      "The version that held up out of sample produced 84 trades at a 1.94 profit factor.",
      "Built on the same volume profile, footprint, and delta signals used to read and execute trades discretionarily in the live prop firm evaluation today.",
    ],
    metrics: [
      { label: "Trading days", value: "121" },
      { label: "Backtest trades", value: "84" },
      { label: "Profit factor", value: "1.94" },
    ],
  },
  {
    title: "Griff",
    logo: "unbelievaboat",
    kind: "Community Economy",
    period: "April 2025 to Present",
    summary:
      "A virtual economy running inside the 2,000 member Discord attached to the channels, built to turn an audience that watches into a community that shows up daily.",
    bullets: [
      "Engineered the currency system end to end: how often each command pays out, the odds of winning or losing on it, the coins at stake per action, and the pricing of everything they buy, from Discord roles to in game Brawl Stars rewards.",
      "Sustained 1,110 participants and roughly 175,000 messages across two channels over 16 months of continuous operation.",
    ],
    href: "/work/griff-leaderboard",
    hrefLabel: "See the full leaderboard",
    metrics: [
      { label: "Participants", value: "1,110" },
      { label: "Messages", value: "~175K" },
    ],
  },
  {
    title: "Forge",
    logo: "forge",
    kind: "AI Fitness App",
    period: "June 2026 to Present",
    summary:
      "A closed beta fitness application that puts calorie and macro logging, workout planning, workout tracking, and weight tracking in one product.",
    href: "https://forgegains.vercel.app",
    hrefLabel: "forgegains.vercel.app",
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
  logo: "rutgers",
  location: "New Brunswick, NJ",
  degree: "Bachelor of Science, Finance",
  period: "September 2025 to May 2029",
  standing: "Sophomore, 69 credits",
  gpa: "3.96, Dean's List every semester",
  coursework: [
    "Financial Management",
    "Statistical Methods in Business",
    "Business Operations Analytics",
    "Financial Accounting",
  ],
  involvement: [
    { org: "Little Investment Bankers at Rutgers", role: "Member" },
    { org: "Ascend New Brunswick", role: "Member" },
  ],
  priorSchool: {
    name: "Millburn High School",
    logo: "millburn",
    period: "2021 to 2025",
    facts: [
      { label: "Athletics", value: "Varsity Swimming (Captain)" },
      { label: "Involvement", value: "Investment Club (Vice President)" },
      { label: "SAT", value: "1540" },
    ],
  },
} as const;

export const skillGroups = [
  {
    title: "Markets and Trading",
    items: [
      "Financial Markets",
      "Options and Futures Trading",
      "Depth of Market",
      "Volume Profile",
      "Footprint Charts",
      "Options Flow",
      "Order Flow Analysis",
      "Trade Journaling",
      "Strategy Backtesting",
      "Risk Management",
    ],
  },
  {
    title: "Investment Research and Analytics",
    items: [
      "Equity Research",
      "Discounted Cash Flow Analysis",
      "Financial Statement Analysis",
      "Equity Valuation",
      "Comparable Company Analysis",
      "Catalyst Analysis",
      "Risk and Mitigant Analysis",
      "Verbal Stock Pitching",
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
      "Content Operations",
      "Team Leadership",
      "Hiring and Training",
      "Community Management",
      "Performance Analytics",
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
] as const;

/**
 * The production side of the toolkit. Shown on the channels tab rather than the
 * profile: a recruiter reading for markets work does not need to know which
 * editor cuts the videos, and it dilutes the page when it sits next to Bloomberg.
 */
export const productionTools = [
  "Claude Code",
  "YouTube Studio",
  "CapCut",
  "DaVinci Resolve",
  "Buffer",
  "Higgsfield",
  "Retention Analytics",
] as const;

export const credentials = [
  "Bloomberg Market Concepts",
  "Bloomberg Finance Fundamentals",
  "CITI Social, Behavioral, and Epidemiologic Research Investigators",
  "Excel Essential Training (Microsoft 365)",
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
] as const;
