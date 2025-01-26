/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.tinsellink.com', // Your website URL
  generateRobotsTxt: true,
  exclude: [
    '/dashboard/*', // Exclude private or admin-like pages
    '/dashboard/signin/[id]', // Dynamic route
    '/profile/[full_name]' // Exclude user profiles
  ],
  transform: async (config, path) => {
    return {
      loc: path, // Absolute URL
      changefreq: 'daily',
      priority: path === '/' ? 1.0 : 0.7,
      lastmod: new Date().toISOString()
    };
  },
  additionalPaths: async (config) => [
    { loc: '/escorts/available-today', changefreq: 'daily', priority: 0.8 },
    { loc: '/escorts/', changefreq: 'daily', priority: 0.8 },
    { loc: '/terms', changefreq: 'monthly', priority: 0.5 },
    { loc: '/privacy-policy', changefreq: 'monthly', priority: 0.5 }
  ],
  sitemapSize: 5000
};
