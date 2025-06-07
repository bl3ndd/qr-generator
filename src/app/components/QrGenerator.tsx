'use client'

import React, { useEffect, useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { ColorPicker } from '@/app/components/ColorPicker'

import { useTranslations } from 'next-intl'

import LanguageSwitcher from '@/app/components/LanguageSwitcher'
import { RelatedArticles } from '@/app/components/Articles'

export default function QRCodeGenerator({ origin }: { origin: string }) {
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
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-indigo-100 via-white to-pink-100 px-4 py-10">
      <div className="max-w-[800px]">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-8">
          {t('title')}
        </h1>

        <div className="max-w-6xl bg-white shadow-2xl rounded-3xl p-8 flex flex-col md:flex-row gap-10 mb-4">
          {/* Left Panel */}
          <div className="md:w-1/2 flex flex-col gap-6 mt-12">
            <div className="flex flex-col gap-4">
              <label className="text-gray-700 font-semibold text-lg">{t('inputLabel')}</label>
              <input
                type="text"
                value={qrString}
                onChange={(e) => setQrString(e.target.value)}
                className="p-3 border border-gray-300 rounded-xl shadow-inner text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                placeholder="Enter URL or text"
              />
            </div>

            <div className="flex md:flex-row gap-6">
              <ColorPicker label="Foreground Color" color={darkColor} setColor={setDarkColor} />
              <ColorPicker label="Background Color" color={lightColor} setColor={setLightColor} />
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

            <button
              onClick={downloadQr}
              className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-600 active:scale-95 transition"
            >
              {t('button')}
            </button>
          </div>
        </div>

        {/*<RelatedArticles />*/}

        <LanguageSwitcher origin={origin} />
      </div>
    </div>
  )
}
