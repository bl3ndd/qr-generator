'use client'

import { Typography, Button } from 'antd'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons'
import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'

import { logEvent } from 'firebase/analytics'
import { analytics, AnalyticsEvents } from '../../analytics/analytics'

// USDT TRC20 первым: стабильная стоимость и копеечная комиссия — самый безболезненный
// вариант для случайного донора, остальные ниже.
//
// В QR кодируем голый адрес, без bitcoin:/tron: схем. Причина та же, что отмечена
// в QrGenerator: схемы кошельки поддерживают через раз, а адрес понимают все.
// Сумму мы не запрашиваем, так что BIP-21 тут ничего бы и не дал.
const wallets = [
  {
    name: 'USDT (TRC20)',
    address: 'TEEjyTXx8x194uEQqtzgsXg9xF44P5LAaW',
  },
  {
    name: 'Bitcoin (BTC)',
    address: 'bc1qug0d0y4mxjcagrfj69dw9f4g7nd6uvu5axkjre',
  },
  {
    name: 'Ethereum (ETH, Arb, Base)',
    address: '0xd05D4DF56A41E129ED77Ab0d60a63957E315A616',
  },
  {
    name: 'LTC (LTC)',
    address: 'ltc1qaysnz4tserjcrjfap28ukhn4k7cpw6m45www2k',
  },
]

export default function DonatePage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = async (address: { name: string; address: string }, index: number) => {
    logEvent(analytics, AnalyticsEvents.donate_address_copy_button_click, { address: address.name })
    try {
      await navigator.clipboard.writeText(address.address)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  return (
    <div className="min-h-screen md:px-4 px-2 py-2 md:py-20 bg-gradient-to-br from-yellow-100 to-white flex justify-center">
      <div className="max-w-xl w-full text-center mt-4">
        <Typography.Title level={2}>Donate</Typography.Title>
        <Typography.Paragraph className="text-base text-gray-600 mb-8">
          If this tool was helpful, feel free to support it with crypto — scan a code with your
          wallet, or copy the address. Thank you for your generosity! This project will be free
          forever
        </Typography.Paragraph>

        <div className="md:space-y-6 space-y-2">
          {wallets.map((wallet, index) => (
            <div key={wallet.name} className="bg-white border rounded-xl shadow-sm p-4 text-left">
              <Typography.Text strong>{wallet.name}</Typography.Text>
              <div className="mt-3 flex items-center gap-4">
                <div className="shrink-0 rounded-lg bg-white p-2 border">
                  <QRCodeSVG
                    value={wallet.address}
                    size={104}
                    level="M"
                    marginSize={2}
                    title={`${wallet.name} wallet address`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <Typography.Text code className="break-all text-xs">
                    {wallet.address}
                  </Typography.Text>
                  <div className="mt-2">
                    <Button
                      size="small"
                      icon={copiedIndex === index ? <CheckOutlined /> : <CopyOutlined />}
                      onClick={() => handleCopy(wallet, index)}
                    >
                      {copiedIndex === index ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="md:mt-10 mt-2">
          <Button type="link" href="/">
            ← Main Page
          </Button>
        </div>
      </div>
    </div>
  )
}
