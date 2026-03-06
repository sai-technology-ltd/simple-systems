export const PRODUCT_NAME = "Simple Hiring";
export const PRODUCT_TAGLINE = "Turn your Notion workspace into a hiring system.";
export const PRODUCT_SUBTITLE =
  "Collect applications, track candidates, and manage your pipeline — all inside Notion.";

export const ONE_TIME_PRICE_USD = 349;

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
    title: "Connect your workspace",
    description: "Connect Notion once, then choose the databases you already use for hiring.",
  },
  {
    title: "Validate your setup",
    description: "We check that your Candidates, Roles, and Stages databases are ready to work together.",
  },
  {
    title: "Activate and share links",
    description: "Pay once, copy your role links, run a test application, and go live.",
  },
];

export const LANDING_AUDIENCE = [
  "Founders hiring without a full ATS",
  "Operators already managing work in Notion",
  "Agencies and small teams that want a reliable setup",
];

export const LANDING_FAQS = [
  {
    question: "Can I complete setup before I pay?",
    answer: "Yes. You can connect Notion, choose databases, and validate everything before activation.",
  },
  {
    question: "Do I need a separate hiring dashboard?",
    answer: "No. Your hiring workflow stays in Notion. Simple Hiring handles the setup, automation, and application links.",
  },
  {
    question: "What happens after activation?",
    answer: "Your role links go live, submissions can be processed, and confirmation emails can send if email is enabled.",
  },
  {
    question: "Can I update my setup later?",
    answer: "Yes. You can reconnect, change databases, and update company details from the workspace screens.",
  },
];
