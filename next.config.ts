import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // In Next.js 15, allowedDevOrigins is handled at the top level of experimental or top level depending on sub-version.
  // Standardizing here to prevent validation errors.
  experimental: {
    // Some versions of Next.js 15 moved this or made it strict. 
    // We remove it from the experimental block if it causes errors, 
    // but typically it's allowedDevOrigins: [...] at the top level for workstation safety.
  },
  // Workstation safety configuration
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
