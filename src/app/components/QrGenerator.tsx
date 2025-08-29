'use client'

import React, { useRef, useState } from 'react'
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react'
import { CustomColorPicker } from '@/app/components/ColorPicker'
import { Input, Typography, Button, Select, Upload, Tooltip, Space } from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'

import { logEvent } from 'firebase/analytics'
import { analytics, AnalyticsEvents } from '../../analytics/analytics'

import {
  UploadOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  DollarOutlined,
  PaperClipOutlined,
  LinkOutlined,
  UserOutlined,
  MailOutlined,
  MessageOutlined,
  WifiOutlined,
  FacebookOutlined,
  TwitterOutlined,
} from '@ant-design/icons'

import LanguageSwitcher from '@/app/components/LanguageSwitcher'
import Link from 'next/link'

type DownloadFormats = 'webp' | 'svg' | 'jpeg' | 'png'
type QRCodeType = 'url' | 'vcard' | 'email' | 'sms' | 'wifi' | 'facebook' | 'twitter'

interface VCardData {
  firstName: string
  lastName: string
  phone: string
  email: string
  company: string
  title: string
  address: string
}

interface EmailData {
  to: string
  subject: string
  body: string
}

interface SMSData {
  phone: string
  message: string
}

interface WiFiData {
  ssid: string
  password: string
  encryption: 'WPA' | 'WEP' | 'nopass'
}

interface SocialData {
  username: string
  message?: string
}

export default function QRCodeGenerator() {
  const [qrType, setQrType] = useState<QRCodeType>('url')
  const [qrString, setQrString] = useState('https://qrafty.cutbg.org/')
  const [darkColor, setDarkColor] = useState('#000000')
  const [lightColor, setLightColor] = useState('#FFFFFF')
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormats>('svg')
  const [logoImage, setLogoImage] = useState<string | null>(null)

  // Form data for different QR types
  const [vcardData, setVcardData] = useState<VCardData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    company: '',
    title: '',
    address: '',
  })

  const [emailData, setEmailData] = useState<EmailData>({
    to: '',
    subject: '',
    body: '',
  })

  const [smsData, setSmsData] = useState<SMSData>({
    phone: '',
    message: '',
  })

  const [wifiData, setWifiData] = useState<WiFiData>({
    ssid: '',
    password: '',
    encryption: 'WPA',
  })

  const [socialData, setSocialData] = useState<SocialData>({
    username: '',
    message: '',
  })

  const qrCanvasRef = useRef<HTMLCanvasElement>(null)
  const qrSvgRef = useRef<SVGSVGElement>(null)

  const isSvg = downloadFormat === 'svg'
  const QRComponent = isSvg ? QRCodeSVG : QRCodeCanvas

  // Generate QR code content based on type
  const generateQRContent = (): string => {
    switch (qrType) {
      case 'url':
        return qrString
      
      case 'vcard':
        const vcard = [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `FN:${vcardData.firstName} ${vcardData.lastName}`,
          `N:${vcardData.lastName};${vcardData.firstName};;;`,
          `TEL:${vcardData.phone}`,
          `EMAIL:${vcardData.email}`,
          `ORG:${vcardData.company}`,
          `TITLE:${vcardData.title}`,
          `ADR:;;${vcardData.address};;;`,
          'END:VCARD'
        ].join('\n')
        return vcard
      
      case 'email':
        const emailUrl = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`
        return emailUrl
      
      case 'sms':
        const smsUrl = `sms:${smsData.phone}?body=${encodeURIComponent(smsData.message)}`
        return smsUrl
      
      case 'wifi':
        const wifiString = `WIFI:T:${wifiData.encryption};S:${wifiData.ssid};P:${wifiData.password};;`
        return wifiString
      
      case 'facebook':
        const facebookUrl = `https://www.facebook.com/${socialData.username}`
        return socialData.message ? `${facebookUrl}?message=${encodeURIComponent(socialData.message)}` : facebookUrl
      
      case 'twitter':
        const twitterUrl = `https://twitter.com/${socialData.username}`
        return socialData.message ? `${twitterUrl}?text=${encodeURIComponent(socialData.message)}` : twitterUrl
      
      default:
        return qrString
    }
  }

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
    const isSvg = downloadFormat === 'svg'
    const qrElement = isSvg ? qrSvgRef.current : qrCanvasRef.current
    if (!qrElement) return

    logEvent(analytics, AnalyticsEvents.qr_download_button_click)
    const size = 300

    const triggerDownload = (url: string, format: string) => {
      const a = document.createElement('a')
      a.href = url
      a.download = `qr.${format}`
      a.click()
    }

    if (isSvg && !logoImage) {
      const serializer = new XMLSerializer()
      const svgString = serializer.serializeToString(qrElement as SVGSVGElement)
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

    const processLogoAndDownload = () => {
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

    // Convert SVG to canvas if needed
    if (isSvg) {
      const svgString = new XMLSerializer().serializeToString(qrElement as SVGSVGElement)
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(svgBlob)
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
        processLogoAndDownload()
      }
      img.src = url
    } else {
      ctx.drawImage(qrElement as HTMLCanvasElement, 0, 0)
      processLogoAndDownload()
    }
  }

  const handleSelectFormat = (val: DownloadFormats) => {
    logEvent(analytics, AnalyticsEvents.format_select_click, { format: val })
    setDownloadFormat(val)
  }

  const handleQRTypeChange = (type: QRCodeType) => {
    setQrType(type)
    logEvent(analytics, AnalyticsEvents.qr_type_change, { type })
  }

  const renderFormFields = () => {
    switch (qrType) {
      case 'url':
        return (
          <div>
            <Typography.Title level={5}>URL</Typography.Title>
            <Input
              type="text"
              size="large"
              value={qrString}
              onChange={(e) => setQrString(e.target.value)}
              placeholder="Enter URL"
              prefix={<LinkOutlined />}
            />
          </div>
        )

      case 'vcard':
        return (
          <div className="space-y-4">
            <Typography.Title level={5}>Contact Information</Typography.Title>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="First Name"
                value={vcardData.firstName}
                onChange={(e) => setVcardData({ ...vcardData, firstName: e.target.value })}
                prefix={<UserOutlined />}
              />
              <Input
                placeholder="Last Name"
                value={vcardData.lastName}
                onChange={(e) => setVcardData({ ...vcardData, lastName: e.target.value })}
                prefix={<UserOutlined />}
              />
              <Input
                placeholder="Phone"
                value={vcardData.phone}
                onChange={(e) => setVcardData({ ...vcardData, phone: e.target.value })}
                prefix={<MessageOutlined />}
              />
              <Input
                placeholder="Email"
                value={vcardData.email}
                onChange={(e) => setVcardData({ ...vcardData, email: e.target.value })}
                prefix={<MailOutlined />}
              />
              <Input
                placeholder="Company"
                value={vcardData.company}
                onChange={(e) => setVcardData({ ...vcardData, company: e.target.value })}
              />
              <Input
                placeholder="Title"
                value={vcardData.title}
                onChange={(e) => setVcardData({ ...vcardData, title: e.target.value })}
              />
            </div>
            <Input
              placeholder="Address"
              value={vcardData.address}
              onChange={(e) => setVcardData({ ...vcardData, address: e.target.value })}
            />
          </div>
        )

      case 'email':
        return (
          <div className="space-y-4">
            <Typography.Title level={5}>Email</Typography.Title>
            <Input
              placeholder="To"
              value={emailData.to}
              onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
              prefix={<MailOutlined />}
            />
            <div className="mb-4">

            <Input
              placeholder="Subject"
              value={emailData.subject}
              onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
            />
            </div>
            <Input.TextArea
              placeholder="Message"
              value={emailData.body}
              onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
              rows={3}
            />
          </div>
        )

      case 'sms':
        return (
          <div className="space-y-4">
            <Typography.Title level={5}>SMS</Typography.Title>
            <Input
              placeholder="Phone Number"
              value={smsData.phone}
              onChange={(e) => setSmsData({ ...smsData, phone: e.target.value })}
              prefix={<MessageOutlined />}
            />
            <Input.TextArea
              placeholder="Message"
              value={smsData.message}
              onChange={(e) => setSmsData({ ...smsData, message: e.target.value })}
              rows={3}
            />
          </div>
        )

      case 'wifi':
        return (
          <div className="space-y-4">
            <Typography.Title level={5}>WiFi Network</Typography.Title>
            <Input
              placeholder="Network Name (SSID)"
              value={wifiData.ssid}
              onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
              prefix={<WifiOutlined />}
            />
            <Input.Password
              placeholder="Password"
              value={wifiData.password}
              onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
            />
            <Select
              value={wifiData.encryption}
              onChange={(value) => setWifiData({ ...wifiData, encryption: value })}
              className="w-full"
            >
              <Select.Option value="WPA">WPA/WPA2/WPA3</Select.Option>
              <Select.Option value="WEP">WEP</Select.Option>
              <Select.Option value="nopass">No Password</Select.Option>
            </Select>
          </div>
        )

      case 'facebook':
        return (
          <div className="space-y-4">
            <Typography.Title level={5}>Facebook</Typography.Title>
            <Input
              placeholder="Username or Page ID"
              value={socialData.username}
              onChange={(e) => setSocialData({ ...socialData, username: e.target.value })}
              prefix={<FacebookOutlined />}
            />
            <Input.TextArea
              placeholder="Message (optional)"
              value={socialData.message}
              onChange={(e) => setSocialData({ ...socialData, message: e.target.value })}
              rows={2}
            />
          </div>
        )

      case 'twitter':
        return (
          <div className="space-y-4">
            <Typography.Title level={5}>Twitter</Typography.Title>
            <Input
              placeholder="Username"
              value={socialData.username}
              onChange={(e) => setSocialData({ ...socialData, username: e.target.value })}
              prefix={<TwitterOutlined />}
            />
            <Input.TextArea
              placeholder="Tweet text (optional)"
              value={socialData.message}
              onChange={(e) => setSocialData({ ...socialData, message: e.target.value })}
              rows={2}
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex flex-col items-center justify-start bg-gradient-to-br from-indigo-100 via-white to-pink-100 px-4 md:py-10 py-4">
      <div className="max-w-[800px]">
        <h1 className="text-2xl md:text-5xl font-bold text-center text-gray-800 md:mb-8 mb-4">
          Qrafty - generate QR code in 5 seconds
        </h1>

        <div className="max-w-6xl bg-white shadow-2xl rounded-3xl p-4 sm:p-8 flex flex-col md:flex-row gap-10 mb-4">
          {/* Left Panel */}
          <div className="md:w-1/2 flex flex-col gap-6 md:mt-12">
            <div>
              <Typography.Title level={5}>QR Code Type</Typography.Title>
              <Select 
                className="w-full" 
                value={qrType} 
                onChange={handleQRTypeChange}
                size="large"
              >
                <Select.Option value="url">
                  <Space>
                    <LinkOutlined />
                    URL
                  </Space>
                </Select.Option>
                <Select.Option value="vcard">
                  <Space>
                    <UserOutlined />
                    Contact (vCard)
                  </Space>
                </Select.Option>
                <Select.Option value="email">
                  <Space>
                    <MailOutlined />
                    Email
                  </Space>
                </Select.Option>
                <Select.Option value="sms">
                  <Space>
                    <MessageOutlined />
                    SMS
                  </Space>
                </Select.Option>
                <Select.Option value="wifi">
                  <Space>
                    <WifiOutlined />
                    WiFi
                  </Space>
                </Select.Option>
                <Select.Option value="facebook">
                  <Space>
                    <FacebookOutlined />
                    Facebook
                  </Space>
                </Select.Option>
                <Select.Option value="twitter">
                  <Space>
                    <TwitterOutlined />
                    Twitter
                  </Space>
                </Select.Option>
              </Select>
            </div>

            {renderFormFields()}

            <div className="flex md:flex-row gap-6">
              <div onClick={() => logEvent(analytics, AnalyticsEvents.foreground_color_click)}>
                <CustomColorPicker
                  label="Foreground Color"
                  color={darkColor}
                  setColor={setDarkColor}
                />
              </div>
              <div onClick={() => logEvent(analytics, AnalyticsEvents.background_color_click)}>
                <CustomColorPicker
                  label="Background Color"
                  color={lightColor}
                  setColor={setLightColor}
                />
              </div>
            </div>

            <div className="w-full flex items-end gap-4">
              <div className="w-40">
                <Typography.Title level={5}>Image Format</Typography.Title>
                <Select className="w-full" value={downloadFormat} onChange={handleSelectFormat}>
                  <Select.Option value="svg">SVG</Select.Option>
                  <Select.Option value="jpeg">JPEG</Select.Option>
                  <Select.Option value="png">PNG</Select.Option>
                  <Select.Option value="webp">WEBP</Select.Option>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <div onClick={() => logEvent(analytics, AnalyticsEvents.upload_logo_click)}>
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
                      Upload Logo
                    </Button>
                  </Upload>
                </div>

                {logoImage && (
                  <div
                    onClick={() => logEvent(analytics, AnalyticsEvents.delete_logo_button_click)}
                  >
                    <DeleteOutlined
                      onClick={() => setLogoImage(null)}
                      style={{ fontSize: '20px' }}
                    />
                  </div>
                )}

                <Tooltip placement="top" title="You can't upload logo with SVG">
                  <InfoCircleOutlined style={{ fontSize: '20px' }} />
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-1/2 flex flex-col items-center gap-6">
            <div className="bg-white p-4 rounded-2xl shadow-xl border relative">
              {isSvg ? (
                <QRCodeSVG
                  value={generateQRContent()}
                  size={300}
                  bgColor={lightColor}
                  fgColor={darkColor}
                  level="H"
                  ref={qrSvgRef}
                  className="rounded-lg"
                />
              ) : (
                <QRCodeCanvas
                  value={generateQRContent()}
                  size={300}
                  bgColor={lightColor}
                  fgColor={darkColor}
                  level="H"
                  ref={qrCanvasRef}
                  className="rounded-lg"
                />
              )}

              {logoImage && (
                <img
                  src={logoImage}
                  alt="Logo"
                  className="absolute w-[60px] h-[60px] object-cover top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white"
                />
              )}
            </div>

            <Button type="primary" size="large" onClick={downloadQr}>
              Download QR Code
            </Button>
          </div>
        </div>

        <div className="md:mt-8 mt-4 mb-4 flex md:flex-row flex-col gap-2 md:items-center">
          <div className="flex gap-2">
            <Link
              href={`/blog`}
              onClick={() => logEvent(analytics, AnalyticsEvents.blog_link_click)}
            >
              <Button icon={<PaperClipOutlined />} size="large" color="default" variant="filled">
                Blog
              </Button>
            </Link>

            <Link
              href={`/donate`}
              onClick={() => logEvent(analytics, AnalyticsEvents.donate_link_click)}
            >
              <Button icon={<DollarOutlined />} size="large" color="danger" variant="filled">
                Donate
              </Button>
            </Link>
          </div>

          {/*<LanguageSwitcher origin={origin} />*/}
        </div>
      </div>
    </div>
  )
}
