/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.squarespace-cdn.com',
        port: '',
        pathname: '/content/**'
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
        port: '',
        pathname: '/**'
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'https://boatmate-backend-production.up.railway.app/:path*',
      },
    ]
  },
}

module.exports = nextConfig
