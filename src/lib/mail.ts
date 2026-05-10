import "server-only";

import nodemailer from "nodemailer";

function requireMailEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required mail environment variable: ${name}`);
  }

  return value;
}

export function getMailer() {
  const port = Number(process.env.SMTP_PORT || 465);

  return nodemailer.createTransport({
    host: requireMailEnv("SMTP_HOST"),
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: {
      user: requireMailEnv("SMTP_USER"),
      pass: requireMailEnv("SMTP_PASS")
    }
  });
}

export async function sendMail(input: { to: string; subject: string; text: string; html?: string }) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!from) {
    throw new Error("Missing required mail environment variable: SMTP_FROM or SMTP_USER");
  }

  await getMailer().sendMail({
    from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html
  });
}
