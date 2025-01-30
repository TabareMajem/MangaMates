/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['your-image-domains.com'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96]
  },
  webpack: (config, { dev, isServer }) => {
    // Optimize CSS
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups.styles = {
        name: 'styles',
        test: /\.(css|scss)$/,
        chunks: 'all',
        enforce: true
      };
    }

    // Add SVG support
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    // Add optimization for string serialization
    config.optimization.moduleIds = 'deterministic';

    return config;
  },
  experimental: {
    // Add modern optimization features
    optimizeCss: true,
    scrollRestoration: true
  }
};

module.exports = nextConfig;
