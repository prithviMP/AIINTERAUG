/** @type {import('next').NextConfig} */
const nextConfig = {
  // Expose API_URL to the browser bundle (Next only inlines NEXT_PUBLIC_* by default)
  env: {
    API_URL: process.env.API_URL || "http://localhost:8000",
  },
};

export default nextConfig;
