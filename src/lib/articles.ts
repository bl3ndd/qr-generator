import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const contentDirectory = path.join(process.cwd(), 'src/content')

export function getPostSlugs(locale: string) {
  const dir = path.join(contentDirectory, locale)
  return fs.readdirSync(dir).map((filename) => filename.replace(/\.md$/, ''))
}

export async function getPostData(locale: string, slug: string) {
  const fullPath = path.join(contentDirectory, locale, `${slug}.md`)

  if (!fs.existsSync(fullPath)) {
    return null // если файла нет, вернём null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const processedContent = await remark().use(html).process(content)
  const contentHtml = processedContent.toString()

  return {
    slug,
    locale,
    contentHtml,
    ...data,
  }
}
export function getAllPosts(locale: string) {
  const slugs = getPostSlugs(locale)
  return slugs.map((slug) => {
    const file = fs.readFileSync(path.join(contentDirectory, locale, `${slug}.md`), 'utf8')
    const { data } = matter(file)
    return {
      slug,
      ...data,
    }
  })
}
