
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/ads/manage', '/shop/manage'],
    },
    sitemap: 'https://spark-dating.web.app/sitemap.xml',
  }
}
