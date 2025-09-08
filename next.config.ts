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

  // Enable static optimization and standalone output
  output: 'standalone',

  // Disable pages router since we're using app router
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],

  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig
