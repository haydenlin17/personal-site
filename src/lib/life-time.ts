/**
 * The Life Time write up, rebuilt as a memo.
 *
 * The source document was a spoken script with the interview's own prompts
 * embedded in it ("what they want here", slide numbers, notes on how to answer
 * follow ups). All of that scaffolding is stripped: what is left is the
 * analysis itself, in written form, with the numbers kept exactly as they were.
 */

export const memo = {
  ticker: "NYSE: LTH",
  company: "Life Time Group Holdings",
  recommendation: "Buy",
  date: "April 2026",
  context: "Prepared for the Rutgers Road to Wall Street interview",
  facts: [
    { label: "Price", value: "~$28" },
    { label: "Market cap", value: "$6.2B" },
    { label: "Trailing P/E", value: "16.8x" },
    { label: "52 week range", value: "$24.14 to $34.99" },
  ],
  thesis:
    "Life Time is a premium brand with real pricing power, rapidly expanding profit margins, and a membership model where each customer is becoming more valuable every quarter. The market has not caught up to that yet.",
} as const;

export type MemoSection = { heading: string; paragraphs: string[] };

export const sections: MemoSection[] = [
  {
    heading: "The setup",
    paragraphs: [
      "The economy is splitting. Higher income consumers keep spending while lower income households pull back, and few industries show it as clearly as fitness. Value gyms like Planet Fitness compete on price at $10 to $15 a month and capture the trade down consumer. Premium operators compete on experience and capture far more spending per member from the trade up consumer.",
      "Both ends are growing. But the premium end has stronger pricing power and stickier revenue, and that is where Life Time sits.",
    ],
  },
  {
    heading: "The business",
    paragraphs: [
      "Life Time operates over 185 athletic resort clubs across the United States and Canada. These are not ordinary gyms. They are 90,000 to 120,000 square foot campuses with resort style pools, tennis and pickleball courts, full spas, recovery areas with cold plunges and saunas, cafes, and full children's programs including competitive swim teams.",
      "The model runs on recurring membership dues, which make up the majority of revenue, plus high margin add on services: personal training, nutrition coaching, and spa treatments. What separates Life Time from Planet Fitness at the low end and Equinox at the high end is the size of each location and the breadth of what happens inside it. Entire families spend full days there. That drives engagement, builds community, and makes cancelling hard, because the club becomes part of a household's daily routine rather than a place to work out.",
    ],
  },
  {
    heading: "One: the financials are accelerating and the multiple has not followed",
    paragraphs: [
      "Revenue grew about 15% in 2025 to $3.00B. Net income more than doubled to $374M. Profit margins went from 6% to 12% in a single year, and operating cash flow reached $871M, up more than 50%.",
      "The per member economics moved with it. Annual revenue per member went from $2,810 in 2023 to $3,351 in 2025, close to a 20% increase in two years. That is not only new members. Existing members are spending more on personal training and spa services.",
      "The stock trades at roughly 17 times earnings, a discount to the S&P at 18 times and a far larger discount to Planet Fitness at 28 times, which is growing at a similar rate. Both companies carry a market cap near $6B, but Life Time generates more than double the revenue and nearly double the net income.",
      "The reason this is not priced in is history. Life Time went public through a SPAC in 2021 carrying heavy debt, which produced negative earnings through 2022, and the market still treats it as a turnaround. Over the past two years the business has fundamentally changed: margins quadrupled, the balance sheet is repairing, and the company generates real free cash flow. The valuation has not caught up to the new reality.",
    ],
  },
  {
    heading: "Two: stickiness and pricing power",
    paragraphs: [
      "I can speak to this directly. I was a member at Life Time's Florham Park location for over 12 years as a competitive swimmer on their club team, joining at the Bronze level and working up through every level to Seniors. Over that period I watched the swim program go from mid pack to a top two team in the state.",
      "That was not an accident. Life Time kept reinvesting in the facility: cold plunges added, gym equipment upgraded, recovery areas expanded. Every upgrade gave members a reason to stay and a reason to accept higher dues. The company reinvests in the experience, the experience improves, members stay longer, and the company earns the right to raise prices.",
      "The data supports it. Roughly 30% of locations currently have a waitlist. A waitlist for a membership costing over $200 a month is pricing power that very few consumer businesses can match.",
    ],
  },
  {
    heading: "Three: capital allocation and alignment",
    paragraphs: [
      "Management recently announced a $500M share repurchase program, about 9% of the current market cap, which is a direct signal that they see the stock as undervalued.",
      "Founder and CEO Bahram Akradi still holds roughly 10% of the company, with total insider ownership around 15%. The person who built the business remains its largest individual stakeholder, which aligns capital decisions with shareholders.",
      "On top of that, the company plans 12 to 14 new club openings per year through 2026 and 2027, funded by cash flow rather than new leverage, with net debt leverage down to roughly 2.0x adjusted EBITDA.",
    ],
  },
  {
    heading: "Risk and mitigant",
    paragraphs: [
      "The main risk is macroeconomic. In a consumer recession, a membership above $200 a month is a visible line item a household might cut.",
      "Three things make that manageable. The core customer base is affluent, dual income, suburban, and historically more insulated from downturns. The company already proved its resilience through the COVID shutdown, a worse shock for a gym business than a typical recession, and accelerated afterwards rather than merely recovering. And the balance sheet now carries net debt leverage near 2.0x EBITDA against more than $870M of annual operating cash flow, which is real flexibility in a harder environment.",
    ],
  },
  {
    heading: "What would change my mind",
    paragraphs: [
      "Membership churn accelerating for two or more consecutive quarters would be a genuine warning sign, because it would mean the pricing power story is breaking down. Deteriorating economics on newly opened clubs would be the second thing to watch, since the expansion plan depends on new locations ramping the way existing ones did.",
    ],
  },
];

export type Row = { label: string; values: string[] };

export const financials = {
  heading: "Financial summary",
  columns: ["FY2023", "FY2024", "FY2025"],
  rows: [
    { label: "Revenue", values: ["$2.22B", "$2.62B", "$3.00B"] },
    { label: "Revenue growth", values: ["n/a", "18.0%", "14.5%"] },
    { label: "Net income", values: ["$76M", "$156M", "$374M"] },
    { label: "Net income growth", values: ["n/a", "+105%", "+139%"] },
    { label: "Profit margin", values: ["3%", "6%", "12%"] },
    { label: "Operating cash flow", values: ["$463M", "$575M", "$871M"] },
    { label: "Shareholder equity", values: ["$2.25B", "$2.61B", "$3.13B"] },
  ] as Row[],
};

export const comps = {
  heading: "Life Time against Planet Fitness",
  columns: ["Life Time (LTH)", "Planet Fitness (PLNT)"],
  rows: [
    { label: "Stock price", values: ["~$28", "~$73"] },
    { label: "Market cap", values: ["$6.2B", "$5.8B"] },
    { label: "FY2025 revenue", values: ["$3.00B", "$1.32B"] },
    { label: "Revenue growth", values: ["14.5%", "12.1%"] },
    { label: "FY2025 net income", values: ["$374M", "$219M"] },
    { label: "Net income growth", values: ["+139%", "+27%"] },
    { label: "Profit margin", values: ["12%", "~17%"] },
    { label: "Trailing P/E", values: ["16.8x", "28.0x"] },
    { label: "Forward P/E", values: ["14.2x", "~22x"] },
    { label: "Total members", values: ["~841K", "~20.8M"] },
    { label: "Annual revenue per member", values: ["~$3,351", "~$63"] },
    { label: "Business model", values: ["Premium, company owned", "Value, franchise"] },
    { label: "Locations", values: ["185+", "~2,900"] },
  ] as Row[],
  note: "Both carry a market cap near $6B. Life Time earns more than double the revenue and nearly double the net income, yet the market charges 28 times earnings for Planet Fitness and 17 for Life Time. At 22 times, still a discount to Planet Fitness, LTH would trade in the mid $30s, roughly 25% above the current price, without the business needing to do anything differently.",
};

export const questions = [
  {
    q: "Why is this not already priced in?",
    a: "The SPAC listing in 2021 carried heavy debt and produced negative earnings through 2022, and the market still frames it as a turnaround. Over the last two years net income went from $76M to $374M and margins quadrupled. The business changed; the valuation has not.",
  },
  {
    q: "What about the 2026 EPS dip?",
    a: "Guidance of $1.61 to $1.64 against $1.66 in 2025 looks like a decline, but 6 to 7 of the 12 to 14 planned openings land in Q4 2026 and carry ramp costs before they contribute revenue. By 2027 those clubs are contributing. It is a timing effect, not a structural one.",
  },
  {
    q: "What makes the customers so sticky?",
    a: "The club becomes infrastructure for the household. Kids on the swim team, one parent in the gym, the other at the spa, meals at the cafe on weekends. Nobody cancels that over a $20 dues increase. The switching cost is not financial, it is the family's schedule.",
  },
];

export const sources = [
  "SEC filings (10-K, 8-K)",
  "Life Time investor relations press releases",
  "Company investor presentation",
  "Yahoo Finance",
  "StockAnalysis.com",
];
