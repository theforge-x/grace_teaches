import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cover images are entered as plain URLs in the CMS (e.g. Supabase
    // Storage, Unsplash, or any other host), so we allow any https source.
    // Tighten this to your specific storage domain(s) once you know them.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
