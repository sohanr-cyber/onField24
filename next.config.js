/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverActions: {
    bodySizeLimit: '2mb' // Set desired value here
  },
  i18n: {
    locales: ['en'], // Add the languages you want to support
    defaultLocale: 'en', // Default language
    localeDetection: false
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
