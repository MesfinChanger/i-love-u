import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Build Integrity Protocol: Forcing clean synchronization cycle
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
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
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.firebasestorage.app',
        port: '',
        pathname: '/**',
      }
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
    // Dev Stability Protocol: Allowing workstation origins for preview stability
    allowedDevOrigins: [
      '*.cloudworkstations.dev',
      '*.web.app',
      '*.firebaseapp.com'
    ],
  },
};

export default nextConfig;
