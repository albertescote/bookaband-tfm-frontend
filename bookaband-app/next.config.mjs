/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'images.pexels.com',
      'images.unsplash.com',
      'lh3.googleusercontent.com',
      'localhost',
    ],
  },
};

export default nextConfig;
