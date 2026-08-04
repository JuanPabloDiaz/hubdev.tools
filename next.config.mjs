/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/category/:category',
        destination: '/:category',
        permanent: true
      },
      {
        source: '/es/category/:category',
        destination: '/es/:category',
        permanent: true
      },
      {
        source: '/en/category/:category',
        destination: '/en/:category',
        permanent: true
      }
    ]
  },
  images: {
    loader: 'custom',
    loaderFile: './loader/cloudinary.js',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dbueuofxjmmgwozundjk.supabase.co'
      }
    ],
    minimumCacheTTL: 2678400, // 31 days
    qualities: [50, 75]
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
}

export default nextConfig
