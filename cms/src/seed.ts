import type { Payload } from 'payload'
import type { Config } from './payload-types'

const locales: Config['locale'][] = ['de', 'en']

const homepageCopy = {
  de: {
    title: 'Energie, Wasser und Klima im Blick.',
    subtitle:
      'Ein Entwurf für die digitale Präsenz von EED Advisory. Inhalt und Positionierung werden mit EED abgestimmt.',
    metaTitle: 'EED Advisory — Entwurf',
    description:
      'Vorgeschlagene Website-Struktur für EED Advisory. Texte und visuelle Richtung sind Entwürfe zur Prüfung.',
  },
  en: {
    title: 'A perspective on energy, water and climate.',
    subtitle:
      'A draft direction for the EED Advisory website. Content and positioning are subject to review by EED.',
    metaTitle: 'EED Advisory — Draft',
    description:
      'Proposed website structure for EED Advisory. Copy and visual direction are drafts for review.',
  },
} as const

export async function seedCMS(payload: Payload, force = false): Promise<void> {
  payload.logger.info('Starting EED Advisory CMS seeding...')

  if (force) {
    const collections = ['pages', 'posts', 'authors', 'media'] as const
    for (const collection of collections) {
      await payload.delete({
        collection: collection as keyof Config['collections'],
        where: {},
      })
    }
  } else {
    const pages = await payload.find({
      collection: 'pages',
      limit: 1,
      pagination: false,
    })
    if (pages.totalDocs > 0) {
      payload.logger.info('Pages already exist; skipping EED Advisory seeding.')
      return
    }
  }

  for (const locale of locales) {
    const isGerman = locale === 'de'
    await payload.updateGlobal({
      slug: 'labels',
      locale,
      data: {
        global: {
          'show-more': isGerman ? 'Mehr anzeigen' : 'Show more',
          'learn-more': isGerman ? 'Mehr erfahren' : 'Learn more',
          'open-menu': isGerman ? 'Menü öffnen' : 'Open menu',
          'close-menu': isGerman ? 'Menü schließen' : 'Close menu',
        },
        posts: {
          'written-by': isGerman ? 'Geschrieben von' : 'Written by',
          'last-updated-at': isGerman ? 'Zuletzt aktualisiert am' : 'Last updated at',
        },
        'not-found-page': {
          title: isGerman ? 'Seite nicht gefunden' : 'Page not found',
          description: isGerman
            ? 'Die angeforderte Seite existiert nicht.'
            : 'The requested page does not exist.',
          'home-page-button': isGerman ? 'Zur Startseite' : 'Go to homepage',
        },
      },
    })
  }

  const germanCopy = homepageCopy.de
  const homepage = await payload.create({
    collection: 'pages',
    locale: 'de',
    data: {
      title: 'Startseite',
      path: '',
      slug: '',
      isRootPage: true,
      breadcrumbs: [],
      meta: {
        title: germanCopy.metaTitle,
        description: germanCopy.description,
        alternatePaths: [],
      },
      hero: {
        title: germanCopy.title,
        subtitle: germanCopy.subtitle,
      },
      sections: [],
      _status: 'published',
    },
  })

  const englishCopy = homepageCopy.en
  await payload.update({
    collection: 'pages',
    id: homepage.id,
    locale: 'en',
    data: {
      title: 'Home',
      path: '',
      slug: '',
      isRootPage: true,
      breadcrumbs: [],
      meta: {
        title: englishCopy.metaTitle,
        description: englishCopy.description,
        alternatePaths: [],
      },
      hero: {
        title: englishCopy.title,
        subtitle: englishCopy.subtitle,
      },
      sections: [],
      _status: 'published',
    },
  })

  await payload.updateGlobal({ slug: 'header', locale: 'de', data: { links: [] } })
  await payload.updateGlobal({ slug: 'header', locale: 'en', data: { links: [] } })
  await payload.updateGlobal({ slug: 'footer', locale: 'de', data: { links: [] } })
  await payload.updateGlobal({ slug: 'footer', locale: 'en', data: { links: [] } })

  payload.logger.info('EED Advisory homepage draft seeded in German and English.')
}
