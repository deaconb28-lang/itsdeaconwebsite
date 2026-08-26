import nodemailer from "nodemailer";

export type MailMessage = {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
};

export type MailResult =
  | { ok: true; provider: "resend" | "smtp" }
  | { ok: false; reason: "unconfigured" | "failed"; detail: string };

/**
 * Sends through whichever provider is configured, preferring Resend.
 *
 * A missing provider is not an error here — an unconfigured deployment gets
 * `reason: "unconfigured"` back, and the contact route turns that into an
 * honest "email me directly" response rather than silently dropping the lead.
 */
export async function sendMail(message: MailMessage): Promise<MailResult> {
  if (process.env.RESEND_API_KEY) {
    return sendViaResend(message, process.env.RESEND_API_KEY);
  }
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return sendViaSmtp(message);
  }
  return {
    ok: false,
    reason: "unconfigured",
    detail:
      "No mail provider configured. Set RESEND_API_KEY, or SMTP_HOST / SMTP_USER / SMTP_PASS.",
  };
}

async function sendViaResend(
  message: MailMessage,
  apiKey: string,
): Promise<MailResult> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: message.from,
        to: [message.to],
        reply_to: message.replyTo,
        subject: message.subject,
        text: message.text,
        html: message.html,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      return {
        ok: false,
        reason: "failed",
        detail: `Resend responded ${response.status}: ${body.slice(0, 400)}`,
      };
    }
    return { ok: true, provider: "resend" };
  } catch (error) {
    return { ok: false, reason: "failed", detail: describe(error) };
  }
}

async function sendViaSmtp(message: MailMessage): Promise<MailResult> {
  const port = Number.parseInt(process.env.SMTP_PORT ?? "587", 10);

  try {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port,
      // Port 465 is implicit TLS; 587 and 25 start plain and upgrade.
      secure: process.env.SMTP_SECURE
        ? process.env.SMTP_SECURE === "true"
        : port === 465,
      auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });

    await transport.sendMail({
      from: message.from,
      to: message.to,
      replyTo: message.replyTo,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });

    return { ok: true, provider: "smtp" };
  } catch (error) {
    return { ok: false, reason: "failed", detail: describe(error) };
  }
}

function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
