import { MetadataRoute } from 'next'
import { techniques } from '@/lib/techniques'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://breathespec.com'

  const techniqueUrls = techniques.map((technique) => ({
    url: `${baseUrl}/breathe/${technique.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/breathe`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/onboarding`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...techniqueUrls,
  ]
}
