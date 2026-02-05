/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export' только для production build
  ...(process.env.NEXT_PUBLIC_BUILD_STANDALONE && {
    output: 'export',
  }),
  basePath: process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_BUILD_STANDALONE ? '/myMoney' : '',
  assetPrefix: process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_BUILD_STANDALONE ? '/myMoney/' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
