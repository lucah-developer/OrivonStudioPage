import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const STATIC_PATHS = ['/', '/proyectos', '/servicios', '/estudio', '/iniciar-proyecto']

function projectPaths() {
  const source = readFileSync(new URL('./src/components/site/projectData.js', import.meta.url), 'utf8')
  return [...source.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => `/proyectos/${match[1]}`)
}

function sitemapXml(origin) {
  const urls = [...STATIC_PATHS, ...projectPaths()]
    .map((path) => `  <url><loc>${origin}${path}</loc></url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

function robotsTxt(origin) {
  return `User-agent: *\nAllow: /\n\nDisallow: /dev/\nDisallow: /videos/\n\nSitemap: ${origin}/sitemap.xml\n`
}

function siteOrigin(fallback) {
  const fromEnv = process.env.VITE_SITE_URL?.trim().replace(/\/$/, '')
  return fromEnv || fallback
}

function seoFiles() {
  return {
    name: 'orivon-seo-files',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split('?')[0]
        if (path !== '/sitemap.xml' && path !== '/robots.txt') return next()
        const origin = siteOrigin(`${req.socket.encrypted ? 'https' : 'http'}://${req.headers.host}`)
        res.setHeader('Content-Type', path === '/sitemap.xml' ? 'application/xml' : 'text/plain')
        res.end(path === '/sitemap.xml' ? sitemapXml(origin) : robotsTxt(origin))
      })
    },
    generateBundle() {
      const origin = siteOrigin('')
      if (!origin) return
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml(origin) })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt(origin) })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    seoFiles(),
  ],
})
