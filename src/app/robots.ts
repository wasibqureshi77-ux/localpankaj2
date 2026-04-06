import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const envUrl = process.env.NEXTAUTH_URL || "";
  const baseUrl = envUrl.includes("localhost") || !envUrl 
    ? "https://localpankaj.com" 
    : envUrl.replace(/\/$/, "");

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/super-admin/', '/dashboard/', '/editor/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
