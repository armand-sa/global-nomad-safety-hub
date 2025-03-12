/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // This is needed for static export with i18n
  trailingSlash: true
};

module.exports = nextConfig;