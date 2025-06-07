'use client'

import React, { useEffect, useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { CustomColorPicker } from '@/app/components/ColorPicker'
import { Input, Typography, Button } from 'antd'
import { useTranslations } from 'next-intl'

import LanguageSwitcher from '@/app/components/LanguageSwitcher'
import Link from 'next/link'

export default function QRCodeGenerator({
  origin,
  locale,
}: {
  origin: string
  locale: string
}): JSX.Element {
  const t = useTranslations()

  const [qrString, setQrString] = useState('https://qrafty.cutbg.org/')
  const [darkColor, setDarkColor] = useState('#000000')
  const [lightColor, setLightColor] = useState('#FFFFFF')
  const [downloadUrl, setDownloadUrl] = useState(null)
  const qrRef = useRef(null)
  const timeoutRef = useRef(null)

  const generateDownloadUrl = () => {
    if (qrRef.current) {
      const url = qrRef.current.toDataURL('image/jpeg')
      setDownloadUrl(url)
    }
  }

  const debouncedGenerateDownloadUrl = () => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      generateDownloadUrl()
    }, 500)
  }

  useEffect(() => {
    debouncedGenerateDownloadUrl()
  }, [darkColor, lightColor, qrString])

  const downloadQr = () => {
    if (downloadUrl) {
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = 'qr.jpeg'
      a.click()
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-indigo-100 via-white to-pink-100 px-4 md:py-10 py-4">
      <div className="max-w-[800px]">
        <h1 className="text-2xl md:text-5xl font-bold text-center text-gray-800 md:mb-8 mb-4">
          {t('title')}
        </h1>

        <div className="max-w-6xl bg-white shadow-2xl rounded-3xl p-4 sm:p-8 flex flex-col md:flex-row gap-10 mb-4">
          {/* Left Panel */}
          <div className="md:w-1/2 flex flex-col gap-6 md:mt-12">
            <div>
              <Typography.Title level={5}>{t('inputLabel')}</Typography.Title>
              <Input
                type="text"
                size="large"
                value={qrString}
                onChange={(e) => setQrString(e.target.value)}
                placeholder="Enter URL or text"
              />
            </div>

            <div className="flex md:flex-row gap-6">
              <CustomColorPicker
                label="Foreground Color"
                color={darkColor}
                setColor={setDarkColor}
              />
              <CustomColorPicker
                label="Background Color"
                color={lightColor}
                setColor={setLightColor}
              />
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-1/2 flex flex-col items-center gap-6">
            <div className="bg-white p-4 rounded-2xl shadow-xl border">
              <QRCodeCanvas
                value={qrString}
                size={300}
                bgColor={lightColor}
                fgColor={darkColor}
                level="H"
                ref={qrRef}
                className="rounded-lg"
              />
            </div>

            <Button type="primary" size="large" onClick={downloadQr}>
              {t('button')}
            </Button>
          </div>
        </div>

        <div className="mt-8 mb-4 flex items-center">
          <Button size="large" color="default" variant="filled">
            <Link href={`/${locale}/blog`}>{t('blog')}</Link>
          </Button>

          <LanguageSwitcher origin={origin} />
        </div>
      </div>
    </div>
  )
}
