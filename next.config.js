const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'images.unsplash.com',
      'i.ibb.co',
      'scontent.fotp8-1.fna.fbcdn.net',
      'tdkhibhxilzbcyhnpzik.supabase.co' // Added Supabase storage domain
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**'
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '**'
      }
    ]
  }
};

module.exports = nextConfig;
