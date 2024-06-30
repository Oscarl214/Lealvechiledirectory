/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    FIREBASE_SERVICE_ACCOUNT_KEY: process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
  },
  images: {
    domains: ['cdn.imagin.studio', 'api.fuelapi.com','lealdirectory.s3.us-east-2.amazonaws.com'],
  },
};

export default nextConfig;
