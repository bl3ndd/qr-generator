// app/[locale]/[slug]/page.tsx
import { getPostData, getPostSlugs } from '@/lib/articles'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale })
  const post = await getPostData(locale, slug)

  return {
    title: post?.title,
    description: post?.description,
    keywords: post?.description.split(', '),
  }
}

export async function generateStaticParams() {
  const locales = ['en', 'ru']
  const paths = locales.flatMap((locale) => getPostSlugs(locale).map((slug) => ({ locale, slug })))

  return paths
}

export default async function PostPage({ params }: { params: { locale: string; slug: string } }) {
  const post = await getPostData(params.locale, params.slug)

  return (
    <>
      {!post && <p>404</p>}

      {post && (
        <main className="markdown-content">
          <h1>{post.title}</h1>
          <article dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </main>
      )}
    </>
  )
}
