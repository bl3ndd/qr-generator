const locales = [
  'cn',
  'de',
  'en',
  'es',
  'fr',
  'hi',
  'id',
  'it',
  'ja',
  'kk',
  'ko',
  'ky',
  'ms',
  'pt',
  'ru',
  'th',
  'tr',
  'uz',
  'vi',
]

// Добавим сюда список всех маршрутов (без локали)
const basePaths = [
  '', // главная страница — `/[locale]`
  '/blog/how-to-create-qr-code-online',
  '/blog/qrafty-new-functionality',
  '/donate',
  // добавь другие базовые маршруты по аналогии
]

module.exports = {
  siteUrl: 'https://qrafty.cutbg.org',
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    }
  },

  additionalPaths: async (config) => {
    const allPaths = []

    for (const locale of locales) {
      for (const basePath of basePaths) {
        const fullPath = `/${locale}${basePath}`
        allPaths.push(await config.transform(config, fullPath))
      }
    }

    return allPaths
  },

  i18n: {
    locales,
    defaultLocale: 'en',
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
}
