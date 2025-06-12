'use client'

import { Typography, Button } from 'antd'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons'
import { useState } from 'react'

import { logEvent } from 'firebase/analytics'
import { analytics, AnalyticsEvents } from '../../analytics/analytics'

const wallets = [
  {
    name: 'Ethereum (ETH, Arb, Base)',
    address: '0xd05D4DF56A41E129ED77Ab0d60a63957E315A616',
  },
  {
    name: 'LTC (LTC)',
    address: 'ltc1qaysnz4tserjcrjfap28ukhn4k7cpw6m45www2k',
  },
  {
    name: 'USDT (TRC20)',
    address: 'TEEjyTXx8x194uEQqtzgsXg9xF44P5LAaW',
  },
  {
    name: 'Bitcoin (BTC)',
    address: 'bc1qug0d0y4mxjcagrfj69dw9f4g7nd6uvu5axkjre',
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
          If this tool was helpful, feel free to support it with crypto. Thank you for your
          generosity! This project will be free forever
        </Typography.Paragraph>

        <div className="md:space-y-6 space-y-2">
          {wallets.map((wallet, index) => (
            <div key={wallet.name} className="bg-white border rounded-xl shadow-sm p-4 text-left">
              <Typography.Text strong>{wallet.name}</Typography.Text>
              <div className="mt-2 flex items-center justify-between">
                <Typography.Text code className="break-all">
                  {wallet.address}
                </Typography.Text>
                <Button
                  size="small"
                  icon={copiedIndex === index ? <CheckOutlined /> : <CopyOutlined />}
                  onClick={() => handleCopy(wallet, index)}
                >
                  {copiedIndex === index ? 'Copied' : 'Copy'}
                </Button>
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
