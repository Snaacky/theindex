const withPreact = require('next-plugin-preact')

const nextConfig = {
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
    domains: ['cdn.discordapp.com', 'localhost'],
  },
}

module.exports = withPreact(nextConfig)
