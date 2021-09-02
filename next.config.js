/**
 * @type {import("next").NextConfig}
 */
const nextConfig = {
    async headers() {
        return [
            {
                // Apply these headers to all routes in your application.
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff"
                    }
                ]
            }
        ]
    },
    images: {
        domains: [
            "cdn.discordapp.com",
            "avatars.dicebear.com"
        ]
    }
}

module.exports = nextConfig
