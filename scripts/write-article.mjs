// Генерит одну новую SEO-статью для блога в src/content/en/<slug>.md.
// Запускается GitHub Action по расписанию (см. .github/workflows/weekly-article.yml).
//
// Тему берём из Search Console: запросы, по которым сайт уже показывается, — это
// доказанный спрос, в отличие от придуманной темы. Если API недоступен, откатываемся
// на прежнее поведение (модель придумывает сама) — одна неудачная среда не должна
// оставлять блог без статьи.
//
// Переводов нет: локализованных версий сайта пока не существует.
import Anthropic from '@anthropic-ai/sdk'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import matter from 'gray-matter'

const DIR = 'src/content/en'
const MODEL = 'claude-opus-5'
const SITE = process.env.GSC_SITE_URL || 'https://qrafty.cutbg.org/'

// Куда вести читателя. Реальные страницы — сверяется перед записью.
const PAGES = [
  ['the QR generator', '/'],
  ['WiFi QR codes', '/wifi-qr-code-generator'],
  ['vCard QR codes', '/vcard-qr-code-generator'],
  ['plain-text QR codes', '/text-qr-code-generator'],
  ['email QR codes', '/email-qr-code-generator'],
  ['SMS QR codes', '/sms-qr-code-generator'],
  ['crypto wallet QR codes', '/crypto-qr-code-generator'],
  ['Facebook QR codes', '/facebook-qr-code-generator'],
  ['Twitter QR codes', '/twitter-qr-code-generator'],
]

const clean = (s) => String(s).replace(/"/g, "'").trim()

// ── 1. Что уже написано ─────────────────────────────────────────────────────
let existing = []
try {
  existing = (await readdir(DIR)).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))
} catch {
  existing = []
}
const done = []
for (const slug of existing) {
  try {
    const { data } = matter(await readFile(join(DIR, `${slug}.md`), 'utf8'))
    done.push(`- ${data.title}`)
  } catch {}
}

// ── 2. Спрос из Search Console ──────────────────────────────────────────────
async function fetchQueries() {
  const raw = process.env.GSC_SERVICE_ACCOUNT_JSON
  if (!raw) return null

  const { JWT } = await import('google-auth-library')
  const creds = JSON.parse(raw)
  const client = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  })
  const { token } = await client.getAccessToken()

  const end = new Date()
  const start = new Date(end.getTime() - 90 * 864e5)
  const iso = (d) => d.toISOString().slice(0, 10)

  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate: iso(start),
        endDate: iso(end),
        dimensions: ['query'],
        rowLimit: 200,
      }),
    },
  )
  if (!res.ok) throw new Error(`GSC ${res.status}: ${(await res.text()).slice(0, 200)}`)

  const rows = (await res.json()).rows || []
  // Брендовые запросы отбрасываем: под них статья не нужна, человек и так пришёл.
  return rows
    .filter((r) => !/qrafty|cutbg/i.test(r.keys[0]))
    .map((r) => ({
      query: r.keys[0],
      impressions: r.impressions,
      clicks: r.clicks,
      position: Math.round(r.position * 10) / 10,
    }))
}

let queries = null
try {
  queries = await fetchQueries()
  console.log(queries ? `GSC: ${queries.length} небрендовых запросов` : 'GSC: секрет не задан, тема будет придумана')
} catch (err) {
  console.log(`GSC недоступен (${err.message}) — тема будет придумана`)
}

// ── 3. Промпт ───────────────────────────────────────────────────────────────
const demand = queries?.length
  ? `Real search queries this site already appears for, over the last 90 days. Each line is: query — impressions, clicks, average position. Pick the topic from THIS list: a query with real impressions that none of the published articles below already answers. Prefer ones with impressions but few clicks and a weak position — those are questions people are asking that the site does not yet answer well.

${queries.slice(0, 60).map((q) => `- ${q.query} — ${q.impressions} impr, ${q.clicks} clicks, pos ${q.position}`).join('\n')}`
  : `Pick a fresh, specific question a real person would type into Google about QR codes. Prefer practical problems over general introductions: why a printed code will not scan, what error correction actually does, whether a code can be changed after printing, what happens to the data in a WiFi code, how big to print one.`

const prompt = `You write SEO blog articles for QRafty (qrafty.cutbg.org) — a free QR code generator that runs entirely in the browser, with no sign-up and no watermark. It supports URL, plain text, WiFi, vCard, email, SMS, crypto wallet and social handles, and lets you customise colours and add a logo.

Pages you can link to, as markdown like [WiFi QR codes](/wifi-qr-code-generator):
${PAGES.map(([label, href]) => `- ${label} → ${href}`).join('\n')}

Already published — do NOT repeat these topics:
${done.join('\n') || '(none yet)'}

${demand}

Write ONE article on that topic, 600-900 words, leading naturally to one of the pages above.

Be accurate and concrete. Do not invent features QRafty does not have. Do not claim a code can be edited after it is generated — these are static codes, the data is in the image. Write like someone who has actually dealt with the problem, not like marketing copy.

Respond with ONLY a JSON object, no markdown fences and no commentary:
{
  "slug": "kebab-case-url-slug",
  "title": "SEO title around 60 chars",
  "description": "meta description around 150 chars",
  "keyword": "the exact query this targets",
  "tags": ["3-5 short lowercase tags"],
  "body": "article body in markdown; start with an intro paragraph, use ## and ### headings, do NOT include an H1"
}`

// ── 4. Генерация и запись ───────────────────────────────────────────────────
const client = new Anthropic() // читает ANTHROPIC_API_KEY из env
const msg = await client.messages
  .stream({ model: MODEL, max_tokens: 8000, thinking: { type: 'adaptive' }, messages: [{ role: 'user', content: prompt }] })
  .finalMessage()

const text = msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('').trim().replace(/^```json\s*|\s*```$/g, '')
const a = JSON.parse(text)

const slug = String(a.slug).toLowerCase().replace(/[^a-z0-9-]/g, '')
if (!slug || existing.includes(slug)) {
  console.log('пустой или повторный slug — ничего не пишем:', slug)
  process.exit(0)
}

// Модель может сослаться на несуществующую страницу — тогда в блоге появится
// битая ссылка, которую никто не заметит. Проверяем перед записью.
const body = String(a.body).trim()
const known = new Set(PAGES.map(([, href]) => href))
const broken = [...new Set([...body.matchAll(/\]\((\/[a-z0-9/-]*)\)/g)].map((m) => m[1]))].filter((h) => !known.has(h))
if (broken.length) {
  console.error(`ссылки на несуществующие страницы: ${broken.join(', ')}`)
  process.exit(1)
}

const meta = {
  title: clean(a.title),
  description: clean(a.description),
  date: new Date().toISOString().slice(0, 10),
  author: 'QRAFTY Team',
  tags: Array.isArray(a.tags) ? a.tags.map(clean) : [],
}

await writeFile(join(DIR, `${slug}.md`), matter.stringify(`\n${body}\n`, meta))
console.log(`написано ${DIR}/${slug}.md${a.keyword ? ` (под запрос: ${a.keyword})` : ''}`)
