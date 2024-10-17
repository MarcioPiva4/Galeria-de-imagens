/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://firebasestorage.googleapis.com/:path*',
        },
      ];
    },
    images: {
        domains: ['firebasestorage.googleapis.com'],
      },
  };
  
  export default nextConfig;
  