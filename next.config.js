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
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**'
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://ec2-3-131-141-161.us-east-2.compute.amazonaws.com:8080/:path*',
        // destination: 'https://boatmate-backend-production.up.railway.app/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
