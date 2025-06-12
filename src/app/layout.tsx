import { getMessages } from 'next-intl/server'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import { AntdRegistry } from '@ant-design/nextjs-registry'

import { SpeedInsights } from '@vercel/speed-insights/next'

import { Metadata } from 'next'
import { appName } from '../../config'
import { Roboto } from 'next/font/google'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  return {
    title: {
      default: 'QRafty — Free Custom QR Code Generator with Colors & Logo',
      template: `%s | ${appName}`,
    },
    description:
      'QRafty is a fast and free QR code generator that lets you customize your QR code with colors, shapes, and logos. Download in high quality instantly.',
    openGraph: {
      title: 'QRafty — Free Custom QR Code Generator with Colors & Logo',
      description:
        'QRafty is a fast and free QR code generator that lets you customize your QR code with colors, shapes, and logos. Download in high quality instantly.',
      url: 'https://qrafty.cutbg.org',
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

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={roboto.className} lang="en">
      <head>
        <link rel="canonical" href="https://qrafty.cutbg.org/en" />
        <meta name="msvalidate.01" content="F1D595D6C9E51FBCD32D16E50F43E7B3" />
      </head>
      <body>
        <AntdRegistry>{children}</AntdRegistry>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
