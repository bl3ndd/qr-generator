'use client'

import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'

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


export default function LanguageSwitcher() {
    const router = useRouter()
    const pathname = usePathname()

    const handleChangeLanguage = (locale: string) => {
        const segments = pathname.split('/')
        segments[1] = locale // предполагаем, что locale всегда на втором уровне
        const newPath = segments.join('/')
        router.push(newPath)
    }

    const currentLocale = pathname.split('/')[1]

    return (
        <div className="flex gap-2">
            {languages.map(({ code, emoji }) => (
                <button
                    key={code}
                    onClick={() => handleChangeLanguage(code)}
                    className="p-1 mb-4"
                    aria-label={`Switch to ${code}`}
                >
                    <div className="cursor-pointer">
                        <p className="w-full h-full font text-2xl">
                            {emoji}
                        </p>

                    </div>

                </button>
            ))}
        </div>
    )
}
