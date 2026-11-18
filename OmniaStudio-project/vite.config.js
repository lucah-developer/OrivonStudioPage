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

const SITE_ORIGIN = 'https://www.orivonstudio.com.ar'

function siteOrigin() {
  const fromEnv = process.env.VITE_SITE_URL?.trim().replace(/\/$/, '')
  return fromEnv || SITE_ORIGIN
}

// En Windows, Vite a veces agrega ?v= a env.mjs y deja __DEFINES__ sin reemplazar.
function fixViteEnvDefines() {
  return {
    name: 'orivon-vite-env-defines',
    apply: 'serve',
    transform(code, id) {
      if (id.includes('vite/dist/client/env.mjs') && code.includes('__DEFINES__')) {
        return code.replace('__DEFINES__', '{}')
      }
    },
  }
}

function seoFiles() {
  return {
    name: 'orivon-seo-files',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split('?')[0]
        if (path !== '/sitemap.xml' && path !== '/robots.txt') return next()
        const origin = siteOrigin()
        res.setHeader('Content-Type', path === '/sitemap.xml' ? 'application/xml' : 'text/plain')
        res.end(path === '/sitemap.xml' ? sitemapXml(origin) : robotsTxt(origin))
      })
    },
    generateBundle() {
      const origin = siteOrigin()
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
    fixViteEnvDefines(),
    seoFiles(),
  ],
})
