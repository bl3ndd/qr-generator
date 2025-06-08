import Link from 'next/link'
import { getAllPosts } from '../../../lib/articles'
import { Button } from 'antd'
import { useTranslations } from 'next-intl'

interface Post {
  slug: string
  title: string
  date?: string
}

interface BlogPageProps {
  params: { locale: string }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params
  const posts: Post[] = getAllPosts(locale)
  const t = useTranslations()

  return (
    <main className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <Button>{t('back')}</Button>
      <h1 className="text-3xl font-bold mt-4 mb-8">Blog</h1>

      <ul className="space-y-4">
        {posts.map(({ slug, title, date }) => (
          <li key={slug} className="border-b border-gray-200 pb-3 last:border-0">
            <Link href={`/${locale}/blog/${slug}`}>{title}</Link>
            {date && <p className="text-gray-500 text-sm mt-1">7 Jun, 2025</p>}
          </li>
        ))}
      </ul>
    </main>
  )
}
