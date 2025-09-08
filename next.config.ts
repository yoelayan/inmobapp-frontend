/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  reactStrictMode: true,

  // This helps with hydration issues in development mode
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,

    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2
  },

  // Enable standalone output for Railway deployment
  output: 'standalone',

  // Remove pageExtensions restriction to allow standard Next.js app router
  // pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],

  // Add trailing slash for better routing compatibility
  trailingSlash: false,

  // Ensure proper asset handling
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,

  // Redirects are now handled in the root page component
  // redirects: async () => {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/home',
  //       permanent: true,
  //       locale: false
  //     }
  //   ]
  // }
}

export default nextConfig
