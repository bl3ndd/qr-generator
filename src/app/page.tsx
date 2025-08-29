import QrGenerator from '@/app/components/QrGenerator'
import { HowToUse } from '@/app/components/HowToUse'
import { Faq } from '@/app/components/Faq'
import { OurProducts } from '@/app/components/OurProducts'

export async function generateMetadata() {
  return {
    title: 'QRafty — Free Custom QR Code Generator with Colors & Logo',
    description:
      'QRafty is a fast and free QR code generator that supports 8 types: URL, Contact (vCard), Email, SMS, WiFi, Facebook, Twitter, and Cryptocurrency. Customize your QR code with colors, shapes, and logos. Download in high quality instantly.',
    keywords:
      'QRafty, QR code generator, free QR code, custom QR code, QR with logo, download QR code, QR code tool, vCard QR code, email QR code, SMS QR code, WiFi QR code, Facebook QR code, Twitter QR code, contact QR code, business card QR code, cryptocurrency QR code, bitcoin QR code, ethereum QR code, crypto payment QR code, usdt qr code, trc20 qr code generator, usdt trc20 qr code'.split(
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
