/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    FIREBASE_SERVICE_ACCOUNT_KEY: process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
  },
  images: {
    domains: ['cdn.imagin.studio', 'api.fuelapi.com'],
  },
};

export default nextConfig;
