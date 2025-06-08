'use client'

import React, { useRef, useState } from 'react'
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react'
import { CustomColorPicker } from '@/app/components/ColorPicker'
import { Input, Typography, Button, Select, Upload, Tooltip } from 'antd'
import { useTranslations } from 'next-intl'
import type { UploadFile } from 'antd/es/upload/interface'

import {
  UploadOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  DollarOutlined,
  PaperClipOutlined,
} from '@ant-design/icons'

import LanguageSwitcher from '@/app/components/LanguageSwitcher'
import Link from 'next/link'

type DownloadFormats = 'webp' | 'svg' | 'jpeg' | 'png'

export default function QRCodeGenerator({ origin, locale }: { origin: string; locale: string }) {
  const t = useTranslations()

  const [qrString, setQrString] = useState('https://qrafty.cutbg.org/')
  const [darkColor, setDarkColor] = useState('#000000')
  const [lightColor, setLightColor] = useState('#FFFFFF')
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormats>('svg')
  const [logoImage, setLogoImage] = useState<string | null>(null)

  const qrRef = useRef<HTMLCanvasElement>(null)

  const isSvg = downloadFormat === 'svg'
  const QRComponent = isSvg ? QRCodeSVG : QRCodeCanvas

  const handleUpload = (file: UploadFile) => {
    if (downloadFormat === 'svg') {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setLogoImage(reader.result as string)
    }
    reader.readAsDataURL(file as unknown as Blob)
    return false
  }

  const drawLogoWithCover = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    size: number,
    radius: number
  ) => {
    const iw = img.width
    const ih = img.height
    const ir = iw / ih
    const sr = 1 // square

    let sx = 0,
      sy = 0,
      sw = iw,
      sh = ih

    if (ir > sr) {
      sw = ih * sr
      sx = (iw - sw) / 2
    } else {
      sh = iw / sr
      sy = (ih - sh) / 2
    }

    // Маска с border-radius
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + size - radius, y)
    ctx.quadraticCurveTo(x + size, y, x + size, y + radius)
    ctx.lineTo(x + size, y + size - radius)
    ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size)
    ctx.lineTo(x + radius, y + size)
    ctx.quadraticCurveTo(x, y + size, x, y + size - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
    ctx.clip()

    ctx.drawImage(img, sx, sy, sw, sh, x, y, size, size)
    ctx.restore()
  }

  const downloadQr = () => {
    if (!qrRef.current) return

    const qrCanvas = qrRef.current
    const size = qrCanvas.width
    const isSvg = downloadFormat === 'svg'

    const triggerDownload = (url: string, format: string) => {
      const a = document.createElement('a')
      a.href = url
      a.download = `qr.${format}`
      a.click()
    }

    if (isSvg && !logoImage) {
      const serializer = new XMLSerializer()
      const svgString = serializer.serializeToString(qrCanvas)
      const blob = new Blob([svgString], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      triggerDownload(url, 'svg')
      return
    }

    // В остальных случаях (PNG, JPG или SVG с логотипом) рисуем на canvas
    const combinedCanvas = document.createElement('canvas')
    combinedCanvas.width = size
    combinedCanvas.height = size
    const ctx = combinedCanvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(qrCanvas, 0, 0)

    const drawAndDownload = () => {
      const dataUrl = combinedCanvas.toDataURL(`image/${isSvg ? 'png' : downloadFormat}`)
      triggerDownload(dataUrl, isSvg ? 'png' : downloadFormat)
    }

    if (logoImage) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const logoSize = size * 0.2
        const x = (size - logoSize) / 2
        const y = (size - logoSize) / 2
        const borderRadius = logoSize * 0.15

        // Скруглённая белая подложка
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.moveTo(x + borderRadius, y)
        ctx.lineTo(x + logoSize - borderRadius, y)
        ctx.quadraticCurveTo(x + logoSize, y, x + logoSize, y + borderRadius)
        ctx.lineTo(x + logoSize, y + logoSize - borderRadius)
        ctx.quadraticCurveTo(x + logoSize, y + logoSize, x + logoSize - borderRadius, y + logoSize)
        ctx.lineTo(x + borderRadius, y + logoSize)
        ctx.quadraticCurveTo(x, y + logoSize, x, y + logoSize - borderRadius)
        ctx.lineTo(x, y + borderRadius)
        ctx.quadraticCurveTo(x, y, x + borderRadius, y)
        ctx.closePath()
        ctx.fill()

        drawLogoWithCover(ctx, img, x, y, logoSize, borderRadius)

        drawAndDownload()
      }
      img.src = logoImage
    } else {
      drawAndDownload()
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

            <div className="w-full flex items-end gap-4">
              <div className="w-40">
                <Typography.Title level={5}>{t('selectLabel')}</Typography.Title>
                <Select
                  className="w-full"
                  value={downloadFormat}
                  onChange={(val: DownloadFormats) => setDownloadFormat(val)}
                >
                  <Select.Option value="svg">SVG</Select.Option>
                  <Select.Option value="jpeg">JPEG</Select.Option>
                  <Select.Option value="png">PNG</Select.Option>
                  <Select.Option value="webp">WEBP</Select.Option>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Upload
                  disabled={downloadFormat === 'svg'}
                  beforeUpload={handleUpload}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button
                    disabled={downloadFormat === 'svg'}
                    icon={<UploadOutlined />}
                    type="default"
                  >
                    {t('uploadLogo')}
                  </Button>
                </Upload>

                {logoImage && (
                  <DeleteOutlined onClick={() => setLogoImage(null)} style={{ fontSize: '20px' }} />
                )}

                <Tooltip placement="top" title={t('tooltip')}>
                  <InfoCircleOutlined style={{ fontSize: '20px' }} />
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-1/2 flex flex-col items-center gap-6">
            <div className="bg-white p-4 rounded-2xl shadow-xl border relative">
              <QRComponent
                value={qrString}
                size={300}
                bgColor={lightColor}
                fgColor={darkColor}
                level="H"
                ref={qrRef}
                className="rounded-lg"
              />

              {logoImage && (
                <img
                  src={logoImage}
                  alt="Logo"
                  className="absolute w-[60px] h-[60px] object-cover top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white"
                />
              )}
            </div>

            <Button type="primary" size="large" onClick={downloadQr}>
              {t('button')}
            </Button>
          </div>
        </div>

        <div className="mt-8 mb-4 flex items-center">
          <div className="flex gap-2">
            <Link href={`/${locale}/blog`}>
              <Button icon={<PaperClipOutlined />} size="large" color="default" variant="filled">
                {t('blog')}
              </Button>
            </Link>

            <Link href={`/${locale}/donate`}>
              <Button icon={<DollarOutlined />} size="large" color="danger" variant="filled">
                {t('donate.title')}
              </Button>
            </Link>
          </div>

          <LanguageSwitcher origin={origin} />
        </div>
      </div>
    </div>
  )
}
