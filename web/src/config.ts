import { PUBLIC_ANALYTICS_DOMAIN, PUBLIC_CONTACT_URL, WEBSITE_URL } from 'astro:env/client'
import type { Locale } from './cms/types'

type WebsiteConfig = {
  url: string
  name: string
  domain: string
  contactUrl: string
  icon: string
  logo: {
    path: string
    url: string
  }
  ogImage: {
    path: (locale: Locale) => string
    url: (locale: Locale) => string
  }
  socialUrls: string[]
}

export const websiteConfig: WebsiteConfig = {
  url: WEBSITE_URL,
  name: 'EED Advisory',
  domain: PUBLIC_ANALYTICS_DOMAIN ?? '',
  contactUrl: PUBLIC_CONTACT_URL ?? '',
  icon: '/icon.svg',
  logo: {
    path: '/eed-mark.svg',
    url: new URL('/eed-mark.svg', WEBSITE_URL).toString(),
  },
  ogImage: {
    path: (locale: Locale) => `/og_${locale}.svg`,
    url: (locale: Locale) => new URL(`/og_${locale}.svg`, WEBSITE_URL).toString(),
  },
  socialUrls: [],
}
