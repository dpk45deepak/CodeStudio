import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": [
      "./vibecode-starters/react-ts/**",
      "./vibecode-starters/nextjs/**",
      "./vibecode-starters/express-simple/**",
      "./vibecode-starters/vue/**",
      "./vibecode-starters/hono-nodejs-starter/**",
      "./vibecode-starters/angular/**",
      "./vibecode-starters/web-platform/**",
      "./vibecode-starters/vite-shadcn/**",
      "./vibecode-starters/tutorialkit/**",
      "./vibecode-starters/typescript/**",
      "./vibecode-starters/js/**",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply isolation to routes outside the playground.
        source: '/((?!playground).*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
      {
        // WebContainer requires cross-origin isolation for SharedArrayBuffer.
        source: '/playground/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
        ],
      },
    ];
  },
  reactStrictMode:false
};

export default nextConfig;