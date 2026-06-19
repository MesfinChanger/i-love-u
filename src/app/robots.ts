import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://spark-dating.web.app';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/ads/manage', '/shop/manage'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
