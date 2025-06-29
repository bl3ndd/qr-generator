import QrGenerator from '@/app/components/QrGenerator'
import { HowToUse } from '@/app/components/HowToUse'
import { Faq } from '@/app/components/Faq'
import { OurProducts } from '@/app/components/OurProducts'

export async function generateMetadata() {
  return {
    title: 'QRafty — Free Custom QR Code Generator with Colors & Logo',
    description:
      'QRafty is a fast and free QR code generator that lets you customize your QR code with colors, shapes, and logos. Download in high quality instantly.',
    keywords:
      'QRafty, QR code generator, free QR code, custom QR code, QR with logo, download QR code, QR code tool'.split(
        ', '
      ),
  }
}

export default async function Index() {
  return (
    <div>
      <QrGenerator />
      <HowToUse />
      <OurProducts />
      <Faq />
    </div>
  )
}
