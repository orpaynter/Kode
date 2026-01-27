import { Resend } from "resend";

export type EmailTemplate = {
  subject: string;
  html: string;
  text?: string;
};

export type SendEmailResult =
  | { success: true; data: any }
  | { success: false; error: string };

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  throw new Error("RESEND_API_KEY is not set");
}

const resend = new Resend(apiKey);

const FROM_EMAIL = process.env.EMAIL_FROM_ADDRESS || "hello@orpaynter.com";
const FROM_NAME = process.env.EMAIL_FROM_NAME || "OrPaynter Team";

const wrapHtml = (body: string) =>
  `<!DOCTYPE html><html><body>${body}</body></html>`;

// Email templates
export const templates = {
  welcome: (name: string): EmailTemplate => ({
    subject: `Command Granted: Welcome to the Orchestrator of Orchestrators`,
    html: wrapHtml(`
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6;">
        <h1 style="color: #2563eb; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;">The Meta-Intelligence Layer is Active.</h1>
        <p style="font-size: 16px;">
          Welcome, ${name}. 
        </p>
        <p style="font-size: 16px;">
          You're here because you realize that more tools and more agents only lead to more chaos. OrPaynter isn't another tool—it's the <strong>Orchestrator of Orchestrators</strong>. 
        </p>
        <p style="font-size: 16px;">
          By correlating 1,100+ validated data points in <strong>0.05ms</strong>, we're giving you a strategic nervous system that ensures your team, your tools, and your AI agents stay aligned to one objective with zero false positives.
        </p>
        <p style="font-size: 16px; background: #f8fafc; padding: 15px; border-left: 4px solid #2563eb;">
          <strong>Next Phase:</strong><br/>
          We are currently onboarding founders in elite cohorts to maintain the 91ms latency threshold. I will reach out personally within 48 hours to begin your integration.
        </p>
        <p style="font-size: 16px;">
          Prepare your primary objective. We'll start there.
        </p>
        <p style="font-size: 16px; margin-top: 30px;">
          Command yours,<br/>
          <strong>The OrPaynter Founder</strong>
        </p>
      </div>
    `),
    text: `Welcome to the Orchestrator of Orchestrators. The meta-intelligence layer is active. We'll reach out within 48 hours.`
  }),
  onboarding: (name: string): EmailTemplate => ({
    subject: `Complete Your OrPaynter Setup`,
    html: wrapHtml(`<h1>Setup Guide</h1><p>Hi ${name}, let's get you onboarded.</p>`),
    text: `Setup guide for ${name}`
  })
};

export const subscriptionTemplates = {
  subscriptionWelcome: (name: string, plan: string, amount: number): EmailTemplate => ({
    subject: `Subscription Confirmed: ${plan}`,
    html: wrapHtml(`<h1>Subscription Active</h1><p>${name}, you're subscribed to ${plan} for $${amount}</p>`),
    text: `Subscription confirmed for ${plan}`
  }),
  subscriptionCanceled: (name: string, plan: string): EmailTemplate => ({
    subject: `Subscription Canceled`,
    html: wrapHtml(`<h1>Subscription Ended</h1><p>${name}, your ${plan} subscription has been canceled.</p>`),
    text: `Subscription canceled`
  })
};

export async function sendEmail(to: string, template: EmailTemplate): Promise<SendEmailResult> {
  try {
    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [to],
      subject: template.subject,
      html: template.html,
      text: template.text
    });

    if ((result as any).error) {
      const err = (result as any).error;
      console.error("[Email] Failed to send:", err);
      return { success: false, error: err.message || "Unknown send error" };
    }

    console.log(`[Email] Sent successfully to ${to}:`, (result as any).data?.id);
    return { success: true, data: (result as any).data };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : "Unknown error";

    console.error("[Email] Error sending email:", error);
    return { success: false, error: message };
  }
}

export async function sendWelcomeEmail(to: string, name: string) {
  return sendEmail(to, templates.welcome(name));
}

export async function sendOnboardingEmail(to: string, name: string) {
  return sendEmail(to, templates.onboarding(name));
}

export async function sendButtonActionEmail(
  to: string,
  name: string,
  buttonName: string,
  nextSteps: string
) {
  return sendEmail(to, {
    subject: `Action Required: ${buttonName}`,
    html: wrapHtml(`<h1>Action Needed</h1><p>Hi ${name}, ${buttonName} - ${nextSteps}</p>`),
    text: `Action: ${buttonName}`
  });
}

export async function sendSubscriptionWelcomeEmail(
  to: string,
  name: string,
  planName: string,
  amount: number
) {
  return sendEmail(to, subscriptionTemplates.subscriptionWelcome(name, planName, amount));
}

export async function sendAdminNewSubscriptionEmail(
  customerName: string,
  customerEmail: string,
  planName: string,
  amount: number
) {
  const adminEmail = process.env.ADMIN_EMAIL || "hello@orpaynter.com";
  return sendEmail(adminEmail, {
    subject: `[New Subscription] ${customerName}`,
    html: wrapHtml(
      `<h1>New Subscription</h1><p>Customer: ${customerName} (${customerEmail})<br>Plan: ${planName}<br>Amount: $${amount}</p>`
    ),
    text: `New subscription from ${customerName} for ${planName}`
  });
}

export async function sendSubscriptionCanceledEmail(
  to: string,
  name: string,
  planName: string
) {
  return sendEmail(to, subscriptionTemplates.subscriptionCanceled(name, planName));
}
