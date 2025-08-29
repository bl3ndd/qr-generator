const basePaths = [
  '', // главная страница — `/[locale]`
  '/blog/how-to-create-qr-code-online',
  '/blog/qrafty-new-functionality',
  '/blog/qr-code-types-update',
  '/donate',
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

    for (const basePath of basePaths) {
      const fullPath = `/${basePath}`
      allPaths.push(await config.transform(config, fullPath))
    }

    return allPaths
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
