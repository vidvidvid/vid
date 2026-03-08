const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  output: 'export',
  eslint: {
    dirs: ['.'],
  },
  typescript: {
    // Chakra UI v3 (@ark-ui/react) has type incompatibilities with React 19's JSX types.
    // Components work correctly at runtime. Remove once upstream types are fixed.
    ignoreBuildErrors: true,
  },
  poweredByHeader: false,
  trailingSlash: true,
  basePath: '',
  reactStrictMode: true,
  transpilePackages: ['three'],
});
