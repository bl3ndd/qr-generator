import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { getMessages } from 'next-intl/server'
import './../globals.css'
import { Analytics } from '@vercel/analytics/next'

import { Metadata } from 'next'
import { appName } from '../../../config'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const messages = await getMessages()
  const { locale } = await params
  return {
    title: {
      default: messages.seo.title,
      template: `%s | ${appName}`,
    },
    description: messages.seo.description,
    openGraph: {
      title: messages.seo.title,
      description: messages.seo.description,
      url: 'https://qrgen.cutbg.org',
      siteName: appName,
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: messages.seo.title,
        },
      ],
      locale: locale,
      type: 'website',
    },
    icons: {
      icon: '/favicon.png',
      shortcut: '/favicon.png',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          {children}
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
