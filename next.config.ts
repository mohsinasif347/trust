import type { NextConfig } from "next";

import withPWAInit from "@ducanh2912/next-pwa";



const withPWA = withPWAInit({

  dest: "public",

  cacheOnFrontEndNav: true,

  aggressiveFrontEndNavCaching: true,

  reloadOnOnline: true,

  disable: process.env.NODE_ENV === "development",

  workboxOptions: {

    disableDevLogs: true,

  },

});



const nextConfig: NextConfig = {

  reactStrictMode: true,

 

  // 1. Turbopack Error Fix:

  // Next.js 16 ko batana ke hum custom configuration (PWA) use kar rahe hain

  turbopack: {},



  // 2. Images Optimization:

  images: {

    remotePatterns: [

      {

        protocol: 'https',

        hostname: '**.supabase.co',

        port: '',

        pathname: '/storage/v1/object/public/**',

      },

    ],

  },



  // 3. Experimental (Next.js 16 specific):

  // Agar aap middleware.ts ko proxy.ts mein convert karte hain

  experimental: {

    // any extra experimental features here

  }

};



export default withPWA(nextConfig);