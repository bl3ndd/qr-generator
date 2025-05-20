'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const languages = [
    { code: "cn", label: "中文", emoji: "🇨🇳" },
    { code: "de", label: "Deutsch", emoji: "🇩🇪" },
    { code: "en", label: "English", emoji: "🇺🇸" },
    { code: "es", label: "Español", emoji: "🇪🇸" },
    { code: "fr", label: "Français", emoji: "🇫🇷" },
    { code: "hi", label: "हिन्दी", emoji: "🇮🇳" },
    { code: "id", label: "Bahasa Indonesia", emoji: "🇮🇩" },
    { code: "it", label: "Italiano", emoji: "🇮🇹" },
    { code: "ja", label: "日本語", emoji: "🇯🇵" },
    { code: "kk", label: "Қазақша", emoji: "🇰🇿" },
    { code: "ko", label: "한국어", emoji: "🇰🇷" },
    { code: "ky", label: "Кыргызча", emoji: "🇰🇬" },
    { code: "ms", label: "Bahasa Melayu", emoji: "🇲🇾" },
    { code: "pt", label: "Português", emoji: "🇵🇹" },
    { code: "ru", label: "Русский", emoji: "🇷🇺" },
    { code: "th", label: "ไทย", emoji: "🇹🇭" },
    { code: "tr", label: "Türkçe", emoji: "🇹🇷" },
    { code: "uz", label: "Oʻzbekcha", emoji: "🇺🇿" },
    { code: "vi", label: "Tiếng Việt", emoji: "🇻🇳" },
]

export default function LanguageSwitcher({origin}: { origin: string }) {
    const pathname = usePathname()
    const segments = pathname.split('/')
    const currentLocale = segments[1]

    return (
        <div className="flex gap-2 flex-wrap mb-4 mt-8">
            {languages.map(({ code, emoji }) => {
                const newPath = ['/', code, ...segments.slice(2)].join('/')
                const path = origin + newPath
                return (
                    <Link
                        key={code}
                        href={path}
                        className={clsx(
                            'p-1 text-2xl',
                            currentLocale === code ? 'ring-2 ring-blue-500 rounded' : ''
                        )}
                    >
                        {emoji}
                    </Link>
                )
            })}
        </div>
    )
}