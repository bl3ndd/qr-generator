// middleware.js (или middleware.ts в корне проекта)

import { NextResponse } from 'next/server'

export default function middleware(request) {
  const { pathname } = request.nextUrl
  // Проверяем, если путь начинается с локали вида /en, /fr, /de и т.п.
  // Предположим, что локали - это двухбуквенные коды (или другой шаблон).
  const localePattern = /^\/[a-z]{2}(\/|$)/i

  if (localePattern.test(pathname)) {
    // Если путь содержит локаль, делаем редирект на корень сайта "/"
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // Для остальных путей пропускаем
  return NextResponse.next()
}

// Чтобы middleware применялся ко всем путям, экспортируйте config
export const config = {
  matcher: '/:path*', // применить ко всем путям
}
