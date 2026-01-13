/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Fixes the 1MB limit bug
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com", // Allows Clerk user avatars
      },
      {
        protocol: "https",
        hostname: "randomuser.me", // Useful for testing dummy data
      },
    ],
  },
};

export default nextConfig;