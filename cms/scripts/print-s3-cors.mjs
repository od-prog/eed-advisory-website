const allowedOrigin = process.env.S3_CORS_ALLOWED_ORIGIN

if (!allowedOrigin) {
  console.error(
    'Set S3_CORS_ALLOWED_ORIGIN to the approved origin that opens the Payload admin panel.',
  )
  process.exit(1)
}

let parsedOrigin
try {
  parsedOrigin = new URL(allowedOrigin)
} catch {
  console.error('S3_CORS_ALLOWED_ORIGIN must be a valid HTTP(S) origin.')
  process.exit(1)
}

if (
  !['http:', 'https:'].includes(parsedOrigin.protocol) ||
  (parsedOrigin.protocol === 'http:' &&
    !['localhost', '127.0.0.1', '[::1]'].includes(parsedOrigin.hostname)) ||
  parsedOrigin.origin !== allowedOrigin
) {
  console.error(
    'S3_CORS_ALLOWED_ORIGIN must be an HTTPS origin, or HTTP localhost for local testing.',
  )
  process.exit(1)
}

console.log(
  JSON.stringify(
    {
      CORSRules: [
        {
          AllowedOrigins: [allowedOrigin],
          AllowedHeaders: ['*'],
          AllowedMethods: ['PUT'],
          MaxAgeSeconds: 3000,
        },
      ],
    },
    null,
    2,
  ),
)
