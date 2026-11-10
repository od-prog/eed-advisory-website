const mediaOrigin = process.env.PUBLIC_MEDIA_ORIGIN

if (process.env.VERCEL_ENV === 'production' && !mediaOrigin) {
  throw new Error('PUBLIC_MEDIA_ORIGIN must be set for production deployments.')
}

if (mediaOrigin) {
  const parsedMediaOrigin = new URL(mediaOrigin)
  if (
    !['http:', 'https:'].includes(parsedMediaOrigin.protocol) ||
    parsedMediaOrigin.origin !== mediaOrigin
  ) {
    throw new Error(
      'PUBLIC_MEDIA_ORIGIN must be an HTTP(S) origin without a path or trailing slash.',
    )
  }
}

export const config = {
  headers: [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        {
          key: 'Permissions-Policy',
          value: 'geolocation=(), microphone=(), camera=(), payment=()',
        },
      ],
    },
    ...(mediaOrigin
      ? [
          {
            source: '/media/:path*',
            headers: [
              {
                key: 'Cache-Control',
                value:
                  'public, max-age=2592000, s-maxage=31536000, stale-while-revalidate=86400, immutable',
              },
            ],
          },
        ]
      : []),
  ],
  rewrites: [
    ...(mediaOrigin
      ? [
          {
            source: '/media/:path*',
            destination: `${mediaOrigin}/:path*`,
          },
        ]
      : []),
    { source: '/js/script.js', destination: 'https://plausible.io/js/plausible.js' },
    { source: '/api/event', destination: 'https://plausible.io/api/event' },
  ],
  trailingSlash: false,
}
