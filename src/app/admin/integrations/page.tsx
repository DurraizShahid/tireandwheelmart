"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

const integrations = [
  { name: "Mailchimp", file: "Mailchimp.svg", desc: "Email marketing & audience sync" },
  { name: "Twilio", file: "Twilio.svg", desc: "SMS & voice notifications" },
  { name: "Google Analytics", file: "Google_Analytics.svg", desc: "Traffic & conversion tracking" },
  { name: "Zapier", file: "Zapier.svg", desc: "Automate workflows with 3000+ apps" },
  { name: "Stripe", file: "Stripe.svg", desc: "Payment processing & billing" },
  { name: "PayPal", file: "PayPal.svg", desc: "Online payment gateway" },
  { name: "HubSpot", file: "HubSpot.svg", desc: "CRM & marketing automation" },
  { name: "SendGrid", file: "SendGrid.svg", desc: "Transactional email delivery" },
  { name: "Intercom", file: "Intercom.svg", desc: "Customer messaging & support" },
  { name: "Slack", file: "Slack.svg", desc: "Team communication & alerts" },
  { name: "Zendesk", file: "Zendesk.svg", desc: "Customer service ticketing" },
  { name: "Segment", file: "Segment.svg", desc: "Customer data platform" },
  { name: "AWS", file: "AWS.svg", desc: "Cloud infrastructure & hosting" },
  { name: "Supabase", file: "Supabase.svg", desc: "Database & authentication" },
  { name: "Vercel", file: "Vercel.svg", desc: "Deployment & hosting" },
  { name: "Sentry", file: "Sentry.svg", desc: "Error monitoring & tracing" },
  { name: "Datadog", file: "Datadog.svg", desc: "Infrastructure monitoring" },
  { name: "OpenAI", file: "OpenAI.svg", desc: "AI-powered features & chat" },
  { name: "Google Gemini", file: "Google_Gemini.svg", desc: "AI assistant integration" },
  { name: "Anthropic Claude", file: "Anthropic_Claude.svg", desc: "AI conversation & analysis" },
  { name: "OneSignal", file: "OneSignal.svg", desc: "Push notifications & messaging" },
  { name: "Firebase FCM", file: "Firebase_FCM.svg", desc: "Cloud messaging & notifications" },
  { name: "Facebook", file: "Facebook.svg", desc: "Social media & ads integration" },
  { name: "Instagram", file: "Instagram.svg", desc: "Social media & shopping" },
  { name: "WhatsApp", file: "WhatsApp.svg", desc: "Business messaging & notifications" },
  { name: "Telegram", file: "Telegram.svg", desc: "Bot notifications & updates" },
  { name: "Discord", file: "Discord.svg", desc: "Community & alert webhooks" },
  { name: "QuickBooks", file: "QuickBooks.svg", desc: "Accounting & invoicing" },
  { name: "Xero", file: "Xero.svg", desc: "Online accounting sync" },
  { name: "Klarna", file: "Klarna.svg", desc: "Buy now, pay later" },
  { name: "Apple Pay", file: "Apple_Pay.svg", desc: "Mobile & web payments" },
  { name: "Google Pay", file: "Google_Pay.svg", desc: "Contactless payments" },
  { name: "DHL", file: "DHL.svg", desc: "Shipping & logistics" },
  { name: "FedEx", file: "FedEx.svg", desc: "Shipping rate & tracking" },
  { name: "UPS", file: "UPS.svg", desc: "Shipping & delivery management" },
  { name: "Hotjar", file: "Hotjar.svg", desc: "Heatmaps & user behavior" },
  { name: "Mixpanel", file: "Mixpanel.svg", desc: "Product analytics & insights" },
  { name: "Amplitude", file: "Amplitude.svg", desc: "Event tracking & analytics" },
  { name: "Cloudflare", file: "Cloudflare.svg", desc: "CDN & security" },
  { name: "Auth0", file: "Auth0.svg", desc: "Authentication & SSO" },
  { name: "Clerk", file: "Clerk.svg", desc: "User management & auth" },
  { name: "reCAPTCHA", file: "reCAPTCHA.svg", desc: "Bot protection & security" },
  { name: "hCaptcha", file: "hCaptcha.svg", desc: "Privacy-first CAPTCHA" },
  { name: "Mapbox", file: "Mapbox.svg", desc: "Maps & location services" },
  { name: "Google Maps", file: "Google_Maps.svg", desc: "Location & directions" },
  { name: "GitHub", file: "GitHub.svg", desc: "Source control & CI/CD" },
  { name: "Resend", file: "Resend.svg", desc: "Email API for developers" },
  { name: "Mailgun", file: "Mailgun.svg", desc: "Email delivery API" },
  { name: "Brevo", file: "Brevo.svg", desc: "Email & SMS marketing" },
  { name: "Customer.io", file: "Customer.io.svg", desc: "Automated messaging" },
  { name: "Help Scout", file: "Help_Scout.svg", desc: "Customer support platform" },
  { name: "n8n", file: "n8n.svg", desc: "Self-hosted workflow automation" },
  { name: "Make", file: "Make.svg", desc: "Visual automation platform" },
  { name: "Pipedream", file: "Pipedream.svg", desc: "Event-driven automation" },
  { name: "Braintree", file: "Braintree.svg", desc: "Payment processing" },
  { name: "Square", file: "Square.svg", desc: "Point of sale & payments" },
  { name: "Stripe Connect", file: "Stripe_Connect.svg", desc: "Platform payment routing" },
  { name: "Adyen", file: "Adyen.svg", desc: "Global payment orchestration" },
  { name: "Google Ads", file: "Google_Ads.svg", desc: "Paid advertising platform" },
  { name: "Meta", file: "Meta.svg", desc: "Meta business suite" },
  { name: "Hootsuite", file: "Hootsuite.svg", desc: "Social media management" },
  { name: "Buffer", file: "Buffer.svg", desc: "Social media scheduling" },
  { name: "Branch", file: "Branch.svg", desc: "Mobile deep linking & attribution" },
  { name: "Radar.io", file: "Radar.io.svg", desc: "Geofencing & location tracking" },
  { name: "what3words", file: "what3words.svg", desc: "Location addressing system" },
  { name: "Upstash", file: "Upstash.svg", desc: "Serverless Redis & Kafka" },
  { name: "Redis", file: "Redis.svg", desc: "In-memory data store" },
  { name: "Looker Studio", file: "Looker_Studio.svg", desc: "Data visualization & dashboards" },
  { name: "Power BI", file: "Power_BI.svg", desc: "Business analytics platform" },
  { name: "Tableau", file: "Tableau.svg", desc: "Interactive data visualization" },
  { name: "Metabase", file: "Metabase.svg", desc: "Open-source BI & analytics" },
  { name: "Oracle Micros", file: "Oracle_Micros.svg", desc: "POS & restaurant management" },
  { name: "HERE Maps", file: "HERE_Maps.svg", desc: "Location services & routing" },
  { name: "Dialogflow", file: "Dialogflow.svg", desc: "Conversational AI & chatbots" },
  { name: "ElevenLabs", file: "ElevenLabs.svg", desc: "AI voice synthesis" },
  { name: "Mistral", file: "Mistral.svg", desc: "Open-source AI models" },
  { name: "Hugging Face", file: "Hugging_Face.svg", desc: "ML model hub & inference" },
  { name: "Rasa", file: "Rasa.svg", desc: "Open-source conversational AI" },
  { name: "New Relic", file: "New_Relic.svg", desc: "Application performance monitoring" },
  { name: "Paychex", file: "Paychex.svg", desc: "Payroll & HR management" },
  { name: "Gusto", file: "Gusto.svg", desc: "Payroll, benefits & HR" },
  { name: "ADP", file: "ADP.svg", desc: "HR & payroll solutions" },
  { name: "MYOB", file: "MYOB.svg", desc: "Business management & accounting" },
  { name: "Sage", file: "Sage.svg", desc: "Accounting & payroll" },
  { name: "Zoho Books", file: "Zoho_Books.svg", desc: "Online accounting software" },
  { name: "ActiveCampaign", file: "ActiveCampaign.svg", desc: "Email marketing & automation" },
  { name: "App Store", file: "App_Store.svg", desc: "iOS app promotion" },
  { name: "Google Play", file: "Google_Play.svg", desc: "Android app promotion" },
  { name: "Expo", file: "Expo.svg", desc: "React Native development" },
  { name: "Railway", file: "Railway.svg", desc: "Infrastructure deployment" },
  { name: "AWS S3", file: "AWS_S3.svg", desc: "Cloud object storage" },
  { name: "DoorDash", file: "DoorDash.svg", desc: "Food delivery marketplace" },
  { name: "Uber Eats", file: "Uber_Eats.svg", desc: "Food delivery integration" },
  { name: "Deliveroo", file: "Deliveroo.svg", desc: "Food delivery platform" },
  { name: "Foodpanda", file: "Foodpanda.svg", desc: "Food delivery service" },
  { name: "Talabat", file: "Talabat.svg", desc: "Food delivery integration" },
  { name: "Swiggy", file: "Swiggy.svg", desc: "Food delivery marketplace" },
  { name: "Zomato", file: "Zomato.svg", desc: "Restaurant discovery & delivery" },
  { name: "Careem", file: "Careem.svg", desc: "Ride-hailing & delivery" },
  { name: "Snapchat", file: "Snapchat.svg", desc: "Social media & AR ads" },
  { name: "TikTok", file: "TikTok.svg", desc: "Short-form video & ads" },
  { name: "X (Twitter)", file: "X_Twitter.svg", desc: "Social media integration" },
  { name: "Linktree", file: "Linktree.svg", desc: "Link-in-bio management" },
  { name: "Tamara", file: "Tamara.svg", desc: "Buy now, pay later" },
  { name: "Tabby", file: "Tabby.svg", desc: "Installment payment solution" },
  { name: "EasyPaisa", file: "EasyPaisa.svg", desc: "Mobile wallet & payments" },
  { name: "JazzCash", file: "JazzCash.svg", desc: "Mobile payments & transfers" },
  { name: "Microsoft Teams", file: "Microsoft_Teams.svg", desc: "Team collaboration & meetings" },
];

export default function IntegrationsPage() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
              <p className="text-muted-foreground">
                {integrations.length} integrations available to connect
              </p>
            </div>

            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle>Demo Version</AlertTitle>
              <AlertDescription>
                Integrations are not available in this demo. This page is a placeholder for the full version.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {integrations.map((app) => (
                <Card
                  key={app.name}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => toast(`"${app.name}" integration is not available in this demo`)}
                >
                  <CardContent className="flex flex-col items-center justify-center gap-2 p-4">
                    <img
                      src={`/icons/${app.file}`}
                      alt={app.name}
                      className="h-8 w-8"
                    />
                    <span className="text-xs font-medium text-center leading-tight">{app.name}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
