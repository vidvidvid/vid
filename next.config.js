const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  output: 'export',
  eslint: {
    dirs: ['.'],
  },
  outputFileTracingRoot: __dirname,
  devIndicators: false,
  poweredByHeader: false,
  trailingSlash: true,
  basePath: '',
  reactStrictMode: true,
  transpilePackages: ['three'],
});
