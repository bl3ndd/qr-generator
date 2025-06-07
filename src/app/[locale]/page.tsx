import { getTranslations } from 'next-intl/server'
import QrGenerator from '@/app/components/QrGenerator'
import { headers } from 'next/headers'

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

export default async function Index({ params }: Props) {
  const { locale } = await params
  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const origin = `${protocol}://${host}`

  return (
    <div>
      <QrGenerator origin={origin} locale={locale} />
    </div>
  )
}
