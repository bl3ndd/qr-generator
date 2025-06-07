import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { getMessages } from 'next-intl/server'
import './../globals.css'
import { Analytics } from '@vercel/analytics/next'
import { AntdRegistry } from '@ant-design/nextjs-registry'

import { Metadata } from 'next'
import { appName } from '../../../config'
import { Roboto } from 'next/font/google'

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
      url: 'https://qrafty.cutbg.org',
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

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'], // нужные веса
  variable: '--font-roboto', // для CSS-переменной (опционально)
})

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
    <html className={roboto.className} lang={locale}>
      <head>
        <meta name="msvalidate.01" content="F1D595D6C9E51FBCD32D16E50F43E7B3" />
      </head>
      <body>
        <NextIntlClientProvider>
          <AntdRegistry>{children}</AntdRegistry>
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
