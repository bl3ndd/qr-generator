import { getTranslations } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords').split(', '),
  }
}

export default function HowToCreateQrCode() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-2">
      <div className="prose lg:prose-xl bg-white/95 shadow-2xl rounded-3xl p-8 max-w-2xl mx-auto transition-all">
        <Link href="/" className={`block mt-4 py-3 px-2 rounded-xl font-semibold shadow-sm w-fit`}>
          {t('pages.main')}
        </Link>
      </div>
    </div>
  )
}
