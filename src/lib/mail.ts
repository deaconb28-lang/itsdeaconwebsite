import nodemailer from "nodemailer";

import { env, envBool, envInt } from "@/lib/env";

export type MailMessage = {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
};

export type MailResult =
  | {
      ok: true;
      provider: "resend" | "smtp";
      /** The provider's id for this message, for tracing a lead later. */
      id: string | null;
    }
  | { ok: false; reason: "unconfigured" | "failed"; detail: string };

/**
 * Sends through whichever provider is configured, preferring Resend.
 *
 * A missing provider is not an error here — an unconfigured deployment gets
 * `reason: "unconfigured"` back, and the contact route turns that into an
 * honest "email me directly" response rather than silently dropping the lead.
 */
export async function sendMail(message: MailMessage): Promise<MailResult> {
  const resendKey = env("RESEND_API_KEY");
  if (resendKey) return sendViaResend(message, resendKey);

  const smtp = {
    host: env("SMTP_HOST"),
    user: env("SMTP_USER"),
    pass: env("SMTP_PASS"),
  };
  if (smtp.host && smtp.user && smtp.pass) {
    return sendViaSmtp(message, smtp.host, smtp.user, smtp.pass);
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

    const body = (await response.json().catch(() => null)) as { id?: string } | null;
    return { ok: true, provider: "resend", id: body?.id ?? null };
  } catch (error) {
    return { ok: false, reason: "failed", detail: describe(error) };
  }
}

async function sendViaSmtp(
  message: MailMessage,
  host: string,
  user: string,
  pass: string,
): Promise<MailResult> {
  const port = envInt("SMTP_PORT", 587);

  try {
    const transport = nodemailer.createTransport({
      host,
      port,
      // Port 465 is implicit TLS; 587 and 25 start plain and upgrade.
      secure: envBool("SMTP_SECURE") ?? port === 465,
      auth: { user, pass },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });

    const info = await transport.sendMail({
      from: message.from,
      to: message.to,
      replyTo: message.replyTo,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });

    return { ok: true, provider: "smtp", id: info.messageId ?? null };
  } catch (error) {
    return { ok: false, reason: "failed", detail: describe(error) };
  }
}

function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
