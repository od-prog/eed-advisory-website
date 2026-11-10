// @ts-check
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField } from 'astro/config'
import { getRedirects } from './src/cms/getRedirects'

const mediaOrigin = process.env.PUBLIC_MEDIA_ORIGIN

export default defineConfig({
  redirects: await getRedirects(),
  adapter: vercel({
    middlewareMode: 'edge',
  }),
  vite: {
    plugins: [tailwindcss()],
    // Local dev proxy for /media/* - uses the same configured origin as Vercel.
    server: {
      proxy: mediaOrigin
        ? {
            '/media': {
              target: mediaOrigin,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/media/, ''),
              configure: (proxy) => {
                proxy.on('proxyRes', (proxyRes) => {
                  proxyRes.headers['cache-control'] =
                    'public, max-age=2592000, s-maxage=31536000, stale-while-revalidate=86400, immutable'
                })
              },
            },
          }
        : {},
    },
  },
  trailingSlash: 'never',
  env: {
    schema: {
      WEBSITE_URL: envField.string({
        context: 'client',
        access: 'public',
      }),
      PUBLIC_CONTACT_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      PUBLIC_ANALYTICS_DOMAIN: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      CMS_URL: envField.string({
        context: 'client',
        access: 'public',
      }),
      CMS_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
      }),
      PREVIEW_SECRET: envField.string({
        context: 'server',
        access: 'secret',
      }),
      VERCEL_ENV: envField.enum({
        values: ['production', 'preview', 'development'],
        context: 'server',
        access: 'public',
      }),
    },
  },
})
