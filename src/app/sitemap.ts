import { MetadataRoute } from 'next';
import connectDB from '@/lib/mongodb';
import { Service } from '@/models/Service';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use production URL always, even if NEXTAUTH_URL is localhost in dev environment
  const envUrl = process.env.NEXTAUTH_URL || '';
  const baseUrl = envUrl.includes('localhost') || !envUrl 
    ? 'https://localpankaj.com' 
    : envUrl.replace(/\/$/, ""); // Ensure no trailing slash

  let dynamicServices: MetadataRoute.Sitemap = [];
  try {
    await connectDB();
    const services = await Service.find({ isActive: 'ACTIVE' }).select('slug updatedAt');
    
    if (services && services.length > 0) {
      dynamicServices = services.map((service: any) => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: service.updatedAt ? new Date(service.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Sitemap Error: Dynamic content failed:', error);
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/contact',
    '/cart',
    '/checkout',
    '/blog',
    '/services',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.6,
  }));

  return [...staticRoutes, ...dynamicServices];
}
