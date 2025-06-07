import fs from 'fs/promises'
import fetch from 'node-fetch'
import 'dotenv/config'

const { TOLGEE_API_URL, TOLGEE_API_KEY, TOLGEE_PROJECT_ID } = process.env

const OUTPUT_DIR = './src/messages'

async function fetchLanguages() {
  const res = await fetch(`${TOLGEE_API_URL}/v2/projects/${TOLGEE_PROJECT_ID}/languages`, {
    headers: {
      'X-API-Key': TOLGEE_API_KEY,
    },
  })
  const data = await res.json()
  return data._embedded.languages.map((lang) => lang.tag)
}

async function fetchTranslations(lang) {
  const res = await fetch(
    `${TOLGEE_API_URL}/v2/projects/${TOLGEE_PROJECT_ID}/translations/${lang}`,
    {
      headers: {
        'X-API-Key': TOLGEE_API_KEY,
      },
    }
  )
  const data = await res.json()
  return data[lang]
}

async function saveLocale(lang, data) {
  await fs.writeFile(`${OUTPUT_DIR}/${lang}.json`, JSON.stringify(data, null, 2))
}

async function main() {
  const langs = await fetchLanguages()
  for (const lang of langs) {
    console.log(`Fetching ${lang}...`)
    const translations = await fetchTranslations(lang)
    await saveLocale(lang, translations)
  }
  console.log('✅ Locales fetched and saved.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
