import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://localpankaj.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/super-admin/', '/dashboard/', '/editor/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
