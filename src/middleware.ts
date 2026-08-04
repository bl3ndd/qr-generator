import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Локализованные версии свёрнуты, их URL уводим на корень, чтобы не отдавать 404
// по адресам, которые Google успел проиндексировать.
//
// Раньше здесь стоял шаблон /^\/[a-z]{2}(\/|$)/i — он ловил ЛЮБОЙ путь из двух
// букв, а не только локали. Любая будущая короткая страница (/qr, /vc) молча
// уезжала бы на главную. Поэтому список кодов теперь явный.
const LOCALES = [
  'cn', 'de', 'en', 'es', 'fr', 'hi', 'id', 'it', 'ja', 'kk',
  'ko', 'ky', 'ms', 'pt', 'ru', 'th', 'tr', 'uz', 'vi',
]

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const first = pathname.split('/')[1]?.toLowerCase()

  if (first && LOCALES.includes(first)) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}
