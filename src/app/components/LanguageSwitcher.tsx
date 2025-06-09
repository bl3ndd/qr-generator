'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { logEvent } from 'firebase/analytics'
import { analytics, AnalyticsEvents } from '@/analytics/analytics'

const languages = [
  { code: 'cn', label: '中文', emoji: '🇨🇳' },
  { code: 'de', label: 'Deutsch', emoji: '🇩🇪' },
  { code: 'en', label: 'English', emoji: '🇺🇸' },
  { code: 'es', label: 'Español', emoji: '🇪🇸' },
  { code: 'fr', label: 'Français', emoji: '🇫🇷' },
  { code: 'hi', label: 'हिन्दी', emoji: '🇮🇳' },
  { code: 'id', label: 'Bahasa Indonesia', emoji: '🇮🇩' },
  { code: 'it', label: 'Italiano', emoji: '🇮🇹' },
  { code: 'ja', label: '日本語', emoji: '🇯🇵' },
  { code: 'kk', label: 'Қазақша', emoji: '🇰🇿' },
  { code: 'ko', label: '한국어', emoji: '🇰🇷' },
  { code: 'ky', label: 'Кыргызча', emoji: '🇰🇬' },
  { code: 'ms', label: 'Bahasa Melayu', emoji: '🇲🇾' },
  { code: 'pt', label: 'Português', emoji: '🇵🇹' },
  { code: 'ru', label: 'Русский', emoji: '🇷🇺' },
  { code: 'th', label: 'ไทย', emoji: '🇹🇭' },
  { code: 'tr', label: 'Türkçe', emoji: '🇹🇷' },
  { code: 'uz', label: 'Oʻzbekcha', emoji: '🇺🇿' },
  { code: 'vi', label: 'Tiếng Việt', emoji: '🇻🇳' },
]

export default function LanguageSwitcher({ origin }: { origin: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const segments = pathname.split('/')
  const currentLocale = segments[1]
  const [, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value
    const newPath = ['/', newLocale, ...segments.slice(2)].join('/')

    logEvent(analytics, AnalyticsEvents.language_select_click, { language: newLocale })

    startTransition(() => {
      router.push(origin + newPath)
    })
  }

  return (
    <div className="w-full flex justify-end">
      <label className="hidden">Select Item</label>
      <select
        value={currentLocale}
        onChange={handleChange}
        className="border-r-8 border-transparent  px-3 py-2 rounded text-lg bg-white "
      >
        {languages.map(({ code, emoji, label }) => (
          <option key={code} value={code}>
            {emoji} {label}
          </option>
        ))}
      </select>
    </div>
  )
}
