export type CommEmailProvider = "resend" | "sendgrid" | "ses" | "mailgun" | "postmark";
export type CommSMSProvider = "twilio" | "plivo" | "vonage" | "aws-sns";
export type CommChannel = "email" | "sms";
export type CommMessageStatus = "queued" | "sent" | "delivered" | "failed" | "bounced" | "opened" | "clicked";
export type CommTemplateCategory = "crm" | "sales" | "orders" | "inventory" | "pos" | "ai-dialer" | "general";

export interface CommEmailConfig {
  provider: CommEmailProvider;
  apiKey: string;
  senderName: string;
  senderEmail: string;
  replyTo: string;
  openTracking: boolean;
  clickTracking: boolean;
}

export interface CommSMSConfig {
  provider: CommSMSProvider;
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioMessagingServiceSid: string;
  twilioPhoneNumber: string;
}

export interface CommAutomationConfig {
  enabled: boolean;
  retryLimit: number;
  retryDelayMinutes: number;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  businessHoursStart: string;
  businessHoursEnd: string;
  businessDays: number[];
  rateLimitPerMinute: number;
  rateLimitPerHour: number;
}

export interface CommConfig {
  email: CommEmailConfig;
  sms: CommSMSConfig;
  automation: CommAutomationConfig;
  updatedAt: string;
  updatedBy: string;
}

export const DEFAULT_COMM_CONFIG: CommConfig = {
  email: {
    provider: "resend",
    apiKey: "",
    senderName: "Tire&Wheel Mart",
    senderEmail: "notifications@tirewheelmart.com",
    replyTo: "support@tirewheelmart.com",
    openTracking: true,
    clickTracking: false,
  },
  sms: {
    provider: "twilio",
    twilioAccountSid: "",
    twilioAuthToken: "",
    twilioMessagingServiceSid: "",
    twilioPhoneNumber: "",
  },
  automation: {
    enabled: true,
    retryLimit: 3,
    retryDelayMinutes: 5,
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
    businessHoursStart: "09:00",
    businessHoursEnd: "17:00",
    businessDays: [1, 2, 3, 4, 5],
    rateLimitPerMinute: 30,
    rateLimitPerHour: 500,
  },
  updatedAt: new Date().toISOString(),
  updatedBy: "",
};

export type CommEventType =
  | "lead.created"
  | "lead.assigned"
  | "lead.followup"
  | "lead.converted"
  | "opportunity.won"
  | "opportunity.lost"
  | "opportunity.quote_sent"
  | "order.created"
  | "order.confirmed"
  | "order.shipped"
  | "order.delivered"
  | "order.cancelled"
  | "order.refunded"
  | "inventory.low_stock"
  | "inventory.out_of_stock"
  | "inventory.reorder_alert"
  | "pos.receipt_email"
  | "pos.receipt_sms"
  | "pos.refund_receipt"
  | "ai_dialer.missed_call"
  | "ai_dialer.callback_reminder"
  | "ai_dialer.conversation_summary"
  | "ai_dialer.appointment_confirmed";

export interface AutomationAction {
  channel: CommChannel;
  templateId: string;
  to: string;
  delayMinutes: number;
  enabled: boolean;
}

export interface AutomationRule {
  id: string;
  name: string;
  event: CommEventType;
  description: string;
  actions: AutomationAction[];
  enabled: boolean;
  conditions?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CommTemplateVariable {
  name: string;
  label: string;
  defaultValue?: string;
}

export interface CommTemplateVersion {
  version: number;
  subject: string;
  body: string;
  createdBy: string;
  createdAt: string;
}

export interface CommTemplate {
  id: string;
  name: string;
  description: string;
  channel: CommChannel;
  category: CommTemplateCategory;
  subject: string;
  body: string;
  variables: CommTemplateVariable[];
  enabled: boolean;
  versions: CommTemplateVersion[];
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

export interface CommMessage {
  id: string;
  channel: CommChannel;
  provider: string;
  to: string;
  from: string;
  subject: string;
  body: string;
  status: CommMessageStatus;
  externalId: string | null;
  errorMessage: string | null;
  errorCode: string | null;
  templateId: string | null;
  templateVersion: number | null;
  eventType: CommEventType | null;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  metadata: Record<string, unknown>;
  retryCount: number;
  maxRetries: number;
  sendAt: string;
  deliveredAt: string | null;
  openedAt: string | null;
  clickedAt: string | null;
  failedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommAnalytics {
  period: { from: string; to: string };
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  totalBounced: number;
  totalOpened: number;
  totalClicked: number;
  deliveryRate: number;
  failureRate: number;
  openRate: number;
  clickRate: number;
  smsSuccessRate: number;
  byChannel: {
    email: { sent: number; delivered: number; failed: number; bounced: number; opened: number };
    sms: { sent: number; delivered: number; failed: number };
  };
  byEvent: Record<string, number>;
  daily: { date: string; sent: number; delivered: number; failed: number }[];
}

export interface SendEmailRequest {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{ filename: string; content: string; contentType: string }>;
  templateId?: string;
  templateVersion?: number;
  eventType?: CommEventType;
  relatedEntityType?: string;
  relatedEntityId?: string;
  metadata?: Record<string, unknown>;
}

export interface SendSMSRequest {
  to: string;
  body: string;
  from?: string;
  messagingServiceSid?: string;
  templateId?: string;
  templateVersion?: number;
  eventType?: CommEventType;
  relatedEntityType?: string;
  relatedEntityId?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailProvider {
  readonly name: string;
  sendEmail(req: SendEmailRequest): Promise<{
    success: boolean;
    externalId?: string;
    error?: string;
    errorCode?: string;
  }>;
  getDeliveryStatus(externalId: string): Promise<{
    status: CommMessageStatus;
    deliveredAt?: string;
    error?: string;
  }>;
  verifyWebhookSignature(signature: string, payload: unknown): boolean;
}

export interface SMSProvider {
  readonly name: string;
  sendSMS(req: SendSMSRequest): Promise<{
    success: boolean;
    externalId?: string;
    error?: string;
    errorCode?: string;
  }>;
  getDeliveryStatus(externalId: string): Promise<{
    status: CommMessageStatus;
    deliveredAt?: string;
    error?: string;
  }>;
}

export type CommQueueItem = {
  id: string;
  channel: CommChannel;
  to: string;
  subject: string;
  status: "pending" | "processing" | "completed" | "failed";
  retryCount: number;
  maxRetries: number;
  nextRetryAt: string | null;
  error: string | null;
  createdAt: string;
};
