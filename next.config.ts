import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // 1. Turbopack/Webpack Force band karein
  // Agar package.json se --webpack hata diya hai toh yahan turbopack: {} ki zaroorat nahi
  
  // 2. Images Optimization (Supabase ke liye perfect hai)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // 3. Edge Runtime Compatibility
  // Ye ensure karega ke Next.js Node.js ke puranay variables inject na karay
  experimental: {
    // Agar koi specific feature chahiye toh yahan rakhein
  }
};

export default nextConfig;