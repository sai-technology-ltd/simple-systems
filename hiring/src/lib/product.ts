export const SITE_NAME = "Simple Hiring";
export const SITE_TAGLINE = "Simple hiring for teams that run on Notion";
export const SITE_SUBTITLE =
  "Collect job applications, organize candidates, and manage hiring stages directly inside your Notion workspace.";
export const PRODUCT_NAME = "Simple Hiring";
export const PRODUCT_TAGLINE = "A hiring workflow system built for Notion-based teams";
export const PRODUCT_SUBTITLE =
  "Simple Hiring gives Notion-based teams a clear process for collecting applications, organizing candidates, and moving people through each hiring stage.";

export const SIMPLE_HIRING_REGULAR_PRICE_USD = 129;
export const SIMPLE_HIRING_LAUNCH_PRICE_USD = 79;
export const ONE_TIME_PRICE_USD = SIMPLE_HIRING_LAUNCH_PRICE_USD;

export const ONBOARDING_STEPS = [
  { id: "company", number: 1, title: "Company details" },
  { id: "notion", number: 2, title: "Connect workspace" },
  { id: "databases", number: 3, title: "Select databases" },
  { id: "activate", number: 4, title: "Activate workspace" },
  { id: "live", number: 5, title: "Go live" },
] as const;

export const REQUIRED_DATABASES = [
  {
    key: "candidates",
    title: "Candidates database",
    help: "Needs a Name field, Email, Role, and Stage.",
  },
  {
    key: "roles",
    title: "Roles database",
    help: "Needs a Role Name field and a Public Slug.",
  },
  {
    key: "stages",
    title: "Stages database",
    help: "Needs a Stage Name field and an Order number.",
  },
] as const;

export const LANDING_HOW_IT_WORKS = [
  {
    title: "Set up your hiring workspace",
    description: "Start with the hiring workspace and confirm the structure your team will use.",
  },
  {
    title: "Connect your Notion database",
    description: "Choose the Notion databases where candidates, roles, and stages will live.",
  },
  {
    title: "Share your application link",
    description: "Publish your application form so candidates can start submitting details.",
  },
  {
    title: "Start receiving candidates",
    description: "New applications enter your hiring workflow in Notion so your team can review and move them through stages.",
  },
];

export const PRODUCT_OVERVIEW = [
  {
    name: "Simple Hiring",
    summary: "Run your hiring workflow in Notion.",
    description:
      "Collect applications, organise candidates, and keep every hiring stage clear in one simple workflow.",
    ctaLabel: "Start Setup",
    ctaHref: "/onboarding",
  },
] as const;

export const LANDING_BENEFITS = [
  {
    title: "Hiring workflows in Notion",
    description: "Keep candidates, roles, and stages in the Notion workspace your team already uses.",
  },
  {
    title: "Application forms",
    description: "Share a clear application form for each role without creating more manual admin work.",
  },
  {
    title: "Candidate organization",
    description: "Applications become candidate records inside Notion so your team can review work in one place.",
  },
  {
    title: "Stage-based hiring",
    description: "Move candidates through each hiring stage with a process that stays clear and easy to maintain.",
  },
  {
    title: "Confirmation emails",
    description: "Keep applicant communication clear with simple confirmation messages when enabled.",
  },
  {
    title: "Simple setup",
    description: "Complete onboarding, connect Notion, and go live with a focused hiring system.",
  },
] as const;

export const LANDING_AUDIENCE = [
  "Teams that already run on Notion and need a clearer hiring workflow",
  "Companies replacing spreadsheets, scattered application emails, and manual candidate tracking",
  "Operators who want a practical hiring system instead of a heavy HR platform",
];

export const LANDING_FAQS = [
  {
    question: "Who is Simple Hiring for?",
    answer:
      "Simple Hiring is for companies that already run on Notion and want a straightforward system for managing hiring.",
  },
  {
    question: "Do I need a Notion workspace?",
    answer:
      "Yes. Simple Hiring is built for teams that already work in Notion and want to run hiring there.",
  },
  {
    question: "What happens after purchase?",
    answer:
      "After purchase, you receive setup details, connect your Notion workspace, and configure the hiring workflow before going live.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Most teams can move through setup quickly once their Notion databases are ready. Timing depends mainly on how your workspace and hiring stages are already structured.",
  },
  {
    question: "Is this a subscription?",
    answer:
      "No. Simple Hiring is currently sold as a one-time license with digital delivery and onboarding.",
  },
  {
    question: "Can I customise my hiring stages?",
    answer:
      "Yes. Your stages live in Notion, so your team can define the workflow that fits how you hire.",
  },
];
