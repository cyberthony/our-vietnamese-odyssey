import createNextIntlPlugin from 'next-intl/plugin';
import createMDX from '@next/mdx';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();
const withMDX = createMDX({
  // Add markdown plugins here if needed
});

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  productionBrowserSourceMaps: false,
  // Enable maximal bundle optimizations and tree-shaking
  experimental: {
    optimizePackageImports: ['framer-motion', 'next-intl', 'leaflet', 'react-leaflet'],
  }
};

export default withNextIntl(withMDX(nextConfig));
