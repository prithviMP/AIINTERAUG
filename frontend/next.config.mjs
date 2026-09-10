/** @type {import('next').NextConfig} */
const nextConfig = {
  // Expose API_URL to the browser bundle (Next only inlines NEXT_PUBLIC_* by default).
  // Accept either API_URL or NEXT_PUBLIC_API_URL so Vercel env naming stays flexible.
  env: {
    API_URL:
      process.env.API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:8000",
  },
};

export default nextConfig;
