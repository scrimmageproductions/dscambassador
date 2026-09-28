/**
 * Admin alert dispatch for items entering the PENDING ADMIN APPROVAL queue.
 *
 * Security note: a Telegram bot token or email API key must never ship
 * inside a client-side bundle -- anything read from `import.meta.env` here
 * is baked into the public JS and readable by anyone who opens dev tools.
 * In a real deployment, this dispatch belongs behind a server or edge
 * function that holds those secrets and this module's `sendAdminAlert`
 * call would POST to that endpoint instead of Telegram/Resend directly.
 * It's still wired to attempt real delivery here so the payload shapes and
 * trigger points are complete, but with nothing configured (the normal
 * state for this repo) it logs what it would have sent and returns without
 * a network call -- which doubles as proof of the graceful-failure path
 * this alert is required to have even once real credentials are wired up.
 */

export type AdminAlertPayload = {
  nodeRegion: string
  requestType: string
  status?: string
  link?: string
}

export function formatAlertMessage({
  nodeRegion,
  requestType,
  status = 'Pending Admin Approval',
  link = '/admin/approvals',
}: AdminAlertPayload): string {
  return [
    '[ ACTION REQUIRED ] // SYSTEM: DSC HQ',
    `NODE: ${nodeRegion}`,
    `TYPE: ${requestType}`,
    `STATUS: ${status}`,
    `LINK: ${link}`,
  ].join('\n')
}

export function buildTelegramPayload(message: string, chatId: string) {
  return {
    chat_id: chatId,
    text: message,
    parse_mode: 'Markdown',
  }
}

export function buildEmailPayload(message: string, to: string, subject = '[ DSC HQ ] Action required') {
  // Shape matches Resend's POST /emails body. SendGrid's /mail/send body
  // nests recipients/content differently but carries the same fields, so
  // swapping providers only means changing the endpoint + this function.
  return {
    from: 'hq-alerts@spenders.club',
    to,
    subject,
    text: message,
  }
}

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN as string | undefined
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID as string | undefined
const EMAIL_API_KEY = import.meta.env.VITE_ADMIN_ALERT_EMAIL_API_KEY as string | undefined
const EMAIL_ALERT_TO = import.meta.env.VITE_ADMIN_ALERT_EMAIL_TO as string | undefined

async function postJson(url: string, body: unknown, headers: Record<string, string> = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`${url} responded ${res.status}`)
}

async function sendTelegramAlert(message: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.info('[adminAlertService] Telegram alert not configured, skipping:\n' + message)
    return
  }
  await postJson(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    buildTelegramPayload(message, TELEGRAM_CHAT_ID),
  )
}

async function sendEmailAlert(message: string) {
  if (!EMAIL_API_KEY || !EMAIL_ALERT_TO) {
    console.info('[adminAlertService] Email alert not configured, skipping:\n' + message)
    return
  }
  await postJson('https://api.resend.com/emails', buildEmailPayload(message, EMAIL_ALERT_TO), {
    Authorization: `Bearer ${EMAIL_API_KEY}`,
  })
}

/**
 * Fire-and-forget: dispatches both channels without being awaited by the
 * caller, and every failure is caught and logged here so a Telegram outage,
 * a missing key, or a network error can never block or crash the approval
 * action that triggered it.
 */
export function sendAdminAlert(payload: AdminAlertPayload) {
  const message = formatAlertMessage(payload)
  void sendTelegramAlert(message).catch((err) => console.warn('[adminAlertService] Telegram alert failed:', err))
  void sendEmailAlert(message).catch((err) => console.warn('[adminAlertService] Email alert failed:', err))
}
