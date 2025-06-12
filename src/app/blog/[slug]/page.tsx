import { getPostData, getPostSlugs } from '@/lib/articles'
import { Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
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
          <Link href={`/blog`}>
            <Button icon={<ArrowLeftOutlined />}></Button>
          </Link>

          <h1>{post.title}</h1>
          <article dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </main>
      )}
    </>
  )
}
