
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'I LOVE U Dating',
    short_name: 'I LOVE U',
    description: 'Respect & Love is Mandatory. AI-powered dating and cultural exchange.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#FF3366',
    icons: [
      {
        src: 'https://picsum.photos/seed/iloveu-logo/192/192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://picsum.photos/seed/iloveu-logo/512/512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
