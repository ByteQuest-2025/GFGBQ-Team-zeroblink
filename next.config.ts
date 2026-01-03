import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Suppress snarkjs/web-worker warnings
    config.ignoreWarnings = [
      { module: /node_modules\/web-worker/ },
      { module: /node_modules\/snarkjs/ },
    ];
    
    // Handle snarkjs properly
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        readline: false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
