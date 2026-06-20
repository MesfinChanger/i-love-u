import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Next.js 15: allowedDevOrigins is now a top-level option for cross-origin safety in workstations
  allowedDevOrigins: [
    '6000-firebase-studio-1781669153012.cluster-xuuc5xf5uvgp6xje3qbpsmzu3o.cloudworkstations.dev',
    'localhost:9002'
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;