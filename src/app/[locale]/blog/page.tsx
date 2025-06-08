import Link from 'next/link'
import { getAllPosts } from '../../../lib/articles'
import { Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

interface Post {
  slug: string
  title: string
  description: string
  date?: string
}

interface BlogPageProps {
  params: { locale: string }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params
  const posts: Post[] = getAllPosts(locale).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const formatDate = (date: string) => {
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString()
  }

  return (
    <main className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <Link href={`/${locale}`}>
        <Button icon={<ArrowLeftOutlined />}></Button>
      </Link>

      <h1 className="text-3xl font-bold mt-4 mb-8">Blog</h1>

      <ul className="space-y-4">
        {posts.map(({ slug, title, date, description }: Post) => (
          <li key={slug} className="border-b border-gray-200 pb-3 last:border-0">
            <Link href={`/${locale}/blog/${slug}`}>{title}</Link>
            {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
            {date && <p className="text-gray-500 text-sm mt-1">{formatDate(date)}</p>}
          </li>
        ))}
      </ul>
    </main>
  )
}
