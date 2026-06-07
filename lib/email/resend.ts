import { promises as fs } from "fs";
import path from "path";

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
  tag?: string;
}

export interface EmailResult {
  ok: boolean;
  id?: string;
  mode: "live" | "demo";
  error?: string;
}

const FROM_ADDRESS = "Maison <orders@maison.com>";
const RESEND_API_URL = "https://api.resend.com/emails";

export async function sendEmail(message: EmailMessage): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return logEmailLocally(message);
  }
  return sendViaResend(apiKey, message);
}

async function sendViaResend(
  apiKey: string,
  message: EmailMessage,
): Promise<EmailResult> {
  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
      }),
    });
    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error("[email] Resend API error:", response.status, errText);
      return {
        ok: false,
        mode: "live",
        error: `Resend returned ${response.status}`,
      };
    }
    const data = (await response.json().catch(() => ({}))) as {
      id?: string;
    };
    return { ok: true, id: data.id, mode: "live" };
  } catch (err) {
    console.error("[email] Resend send failed:", err);
    return {
      ok: false,
      mode: "live",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

interface EmailLogEntry {
  id: string;
  timestamp: string;
  to: string;
  subject: string;
  tag?: string;
  preview: string;
  mode: "demo" | "live";
}

async function logEmailLocally(message: EmailMessage): Promise<EmailResult> {
  const entry: EmailLogEntry = {
    id: `eml_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    to: message.to,
    subject: message.subject,
    tag: message.tag,
    preview: derivePreview(message),
    mode: "demo",
  };

  console.log(
    `[email:dev] -> ${entry.to} | ${entry.subject}\n${entry.preview}\n`,
  );

  await appendToLog(entry);

  return { ok: true, id: entry.id, mode: "demo" };
}

function derivePreview(message: EmailMessage): string {
  if (message.text) return message.text.slice(0, 240);
  return message.html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 240);
}

async function appendToLog(entry: EmailLogEntry): Promise<void> {
  if (process.env.NODE_ENV === "production") return;
  try {
    const logPath = path.join(process.cwd(), "data", "email-log.json");
    let entries: EmailLogEntry[] = [];
    try {
      const raw = await fs.readFile(logPath, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) entries = parsed;
    } catch {
      /* file missing or empty; start fresh */
    }
    entries.unshift(entry);
    if (entries.length > 100) entries = entries.slice(0, 100);
    await fs.mkdir(path.dirname(logPath), { recursive: true });
    await fs.writeFile(logPath, JSON.stringify(entries, null, 2), "utf8");
  } catch (err) {
    console.warn("[email:dev] failed to append to email-log.json:", err);
  }
}
