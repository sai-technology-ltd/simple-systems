export type WorkspaceStatus =
  | "not_started"
  | "in_progress"
  | "setup_complete"
  | "payment_pending"
  | "active"
  | "inactive";

export interface WorkspaceSettings {
  companyName: string;
  replyToEmail: string;
  logoUrl?: string | null;
  emailEnabled: boolean;
}

export interface WorkspaceSummary {
  clientSlug: string;
  status: WorkspaceStatus;
  activatedAt?: string | null;
  settings: WorkspaceSettings;
  notionConnected: boolean;
  paymentPaid: boolean;
  paymentPending?: boolean;
  databasesSaved: boolean;
  selectedDatabases?: Partial<DatabaseSelection>;
  validationPassed: boolean;
  validationMessage?: string | null;
  previewTestAvailable?: boolean;
  previewTestUsed?: boolean;
  webhookUrl?: string | null;
  setupGuideUrl?: string | null;
  emailsSentThisMonth?: number | null;
  monthlyEmailQuota?: number | null;
  emailQuotaExceeded?: boolean;
}

export interface DatabaseOption {
  id: string;
  title: string;
  description?: string | null;
}

export interface DatabaseSelection {
  candidatesDatabaseId: string;
  rolesDatabaseId: string;
  stagesDatabaseId: string;
}

export interface ValidationIssue {
  database: "candidates" | "roles" | "stages" | "workspace";
  message: string;
}

export interface ValidationResult {
  ok: boolean;
  message?: string | null;
  issues: ValidationIssue[];
}

export interface RoleSummary {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  status?: string | null;
  applicationUrl?: string | null;
}

export interface RoleDetail extends RoleSummary {
  clientSlug: string;
  companyName?: string | null;
  workspaceActive: boolean;
  formUrl?: string | null;
  formMode?: "native" | "redirect";
}

export interface StartOnboardingResponse {
  clientSlug: string;
}

export interface NotionConnectResponse {
  authorizationUrl: string;
}

export interface PaymentInitializeResponse {
  authorizationUrl: string;
  reference?: string | null;
}

export interface PaymentVerifyResponse {
  paid: boolean;
  activated?: boolean;
}

export interface TestSubmissionResponse {
  ok: boolean;
  message?: string | null;
}
