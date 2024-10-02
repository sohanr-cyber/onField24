/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverActions: {
    bodySizeLimit: '2mb' // Set desired value here
  },
  i18n: {
    locales: ['bn', 'en'], // Add the languages you want to support
    defaultLocale: 'bn', // Default language
    localeDetection: false
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**'
      },

      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**'
      }
    ]
  },
  async rewrites () {
    return [
      {
        source: '/robots.txt',
        destination: '/api/text/robots'
      },
      {
        source: '/sitemap.xml',
        destination: '/api/text/sitemap'
      }
    ]
  }
}

module.exports = nextConfig
