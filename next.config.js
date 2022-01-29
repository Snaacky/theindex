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
  swcMinify: false // workaround for disabling swc, see https://nextjs.org/docs/messages/failed-loading-swc
}

module.exports = nextConfig
