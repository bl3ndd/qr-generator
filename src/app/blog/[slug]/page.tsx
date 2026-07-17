import { getPostData, getPostSlugs } from '@/lib/articles'
import Link from 'next/link'
import { appName } from '../../../../config'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getPostData(slug)

  return {
    title: post?.title,
    description: post?.description,
    keywords: post?.description.split(', '),
    openGraph: {
      title: post?.title,
      description: post?.description,
      url: `https://qrafty.cutbg.org/blog/${slug}`,
      siteName: appName,
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'QRafty — Free Custom QR Code Generator with Colors & Logo',
        },
      ],
      locale: 'en',
      type: 'website',
    },
  }
}

export default async function PostPage({ params }: { params: { locale: string; slug: string } }) {
  const post = await getPostData(params.slug)

  return (
    <>
      {!post && <p>404</p>}

      {post && (
        <main className="markdown-content">
          <Link
            href="/blog"
            aria-label="Back to blog"
            className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
          </Link>

          <h1>{post.title}</h1>
          <article dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </main>
      )}
    </>
  )
}
