/** @type {import('next').NextConfig} */
const nextConfig = {
  // 👇 Ignores linting errors so builds don't fail
  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      // 👇 ADD THIS ONE!
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      // 👇 OPTIONAL: Add Google just in case (for your own login avatar)
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      }
    ],
  },
};

export default nextConfig;