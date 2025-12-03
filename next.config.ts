// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // if you use Cloudinary later
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "your-upload-domain.com", // replace with your actual upload domain
        pathname: "/**",
      },
      // Add any other external image hosts here
    ],
  },
};

export default nextConfig;