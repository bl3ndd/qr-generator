const fs = require('fs')
const path = require('path')

// Слаги статей берём из файлов, а не списком руками: иначе новая статья
// не попадает в сайтмап, пока кто-нибудь не вспомнит дописать её сюда.
const contentDir = path.join(__dirname, 'src', 'content', 'en')
const blogPaths = fs.existsSync(contentDir)
  ? fs
      .readdirSync(contentDir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => `/blog/${f.replace(/\.md$/, '')}`)
  : []

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

  // Только динамические роуты. Статические (/, /blog, /donate) next-sitemap
  // находит сам по сборке — раньше они дублировались отсюда же вручную,
  // из-за чего /donate попадал в сайтмап дважды.
  additionalPaths: async (config) => Promise.all(blogPaths.map((p) => config.transform(config, p))),

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
}
