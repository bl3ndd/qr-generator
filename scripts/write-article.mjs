// Генерит одну новую SEO-статью для блога через Claude API в src/content/en/<slug>.md.
// Запускается GitHub Action по расписанию (см. .github/workflows/weekly-article.yml).
//
// Переводов тут нет — локализованных версий сайта пока не существует. Когда появятся,
// сюда добавится второй шаг, как это сделано в cutbg.
import Anthropic from '@anthropic-ai/sdk'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import matter from 'gray-matter'

const DIR = 'src/content/en'
const MODEL = 'claude-opus-5'

// Куда вести читателя. Это реальные страницы, а не выдумка — проверяется ниже.
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
const client = new Anthropic() // читает ANTHROPIC_API_KEY из env

// Уже опубликованные темы — чтобы не писать одно и то же по кругу.
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

const prompt = `You write SEO blog articles for QRafty (qrafty.cutbg.org) — a free QR code generator that runs entirely in the browser, with no sign-up and no watermark. It supports URL, plain text, WiFi, vCard, email, SMS, crypto wallet and social handles, and lets you customise colours and add a logo.

Pages you can link to, as markdown like [WiFi QR codes](/wifi-qr-code-generator):
${PAGES.map(([label, href]) => `- ${label} → ${href}`).join('\n')}

Already published — do NOT repeat these topics:
${done.join('\n') || '(none yet)'}

Write ONE new article on a fresh, specific question a real person would type into Google about QR codes, and that leads naturally to one of the pages above. Prefer practical problems over general introductions: why a printed code will not scan, what error correction actually does, whether a code can be changed after printing, what happens to the data in a WiFi code, how big to print one. 600-900 words.

Be accurate and concrete. Do not invent features QRafty does not have. Do not claim a code can be edited after it is generated — these are static codes, the data is in the image. Write like someone who has actually dealt with the problem, not like marketing copy.

Respond with ONLY a JSON object, no markdown fences and no commentary:
{
  "slug": "kebab-case-url-slug",
  "title": "SEO title around 60 chars",
  "description": "meta description around 150 chars",
  "tags": ["3-5 short lowercase tags"],
  "body": "article body in markdown; start with an intro paragraph, use ## and ### headings, do NOT include an H1"
}`

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
const linked = [...body.matchAll(/\]\((\/[a-z0-9/-]*)\)/g)].map((m) => m[1])
const broken = [...new Set(linked)].filter((href) => !known.has(href))
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
console.log('написано', `${DIR}/${slug}.md`)
