/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

export default nextConfig;
module.exports = {
  webpack: (config: any) => {
    config.cache = false;
    return config;
  },
};
