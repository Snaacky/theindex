const withPWA = require('next-pwa')

const nextConfig = {
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
  images: {
    domains: [
        'cdn.discordapp.com',
        'localhost'
    ],
  },
}

module.exports = withPWA(nextConfig)
