'use client'

import { Typography, Button } from 'antd'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

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
  const t = useTranslations()
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = async (address: string, index: number) => {
    try {
      await navigator.clipboard.writeText(address)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  return (
    <div className="min-h-screen md:px-4 px-2 py-2 md:py-20 bg-gradient-to-br from-yellow-100 to-white flex justify-center">
      <div className="max-w-xl w-full text-center mt-4">
        <Typography.Title level={2}>{t('donate.title')}</Typography.Title>
        <Typography.Paragraph className="text-base text-gray-600 mb-8">
          {t('donate.description')}
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
                  onClick={() => handleCopy(wallet.address, index)}
                >
                  {copiedIndex === index ? t('copied') : t('copy')}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="md:mt-10 mt-2">
          <Button type="link" href="/">
            ← {t('pages.main')}
          </Button>
        </div>
      </div>
    </div>
  )
}
