import { MetadataRoute } from 'next';
import connectDB from '@/lib/mongodb';
import { Service } from '@/models/Service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  let dynamicServices = [];
  try {
    await connectDB();
    const services = await Service.find({ isActive: 'ACTIVE' }).select('slug updatedAt');
    dynamicServices = services.map((service: any) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: service.updatedAt ? new Date(service.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Sitemap dynamic content failed to load:', error);
  }

  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/cart',
    '/checkout',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.6,
  }));

  return [...staticRoutes, ...dynamicServices];
}
