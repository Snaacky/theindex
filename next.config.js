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
    dangerouslyAllowSVG: true,
    domains: ['cdn.discordapp.com', 'localhost'],
  },
}

module.exports = nextConfig
