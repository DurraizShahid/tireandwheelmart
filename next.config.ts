import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Webpack config for component tagger (only works with webpack, not Turbopack)
  // Use "npm run dev:webpack" to enable this, or "npm run dev" for Turbopack
  webpack: (config) => {
    if (process.env.NODE_ENV === "development") {
      config.module.rules.push({
        test: /\.(jsx|tsx)$/,
        exclude: /node_modules/,
        enforce: "pre",
        use: "@dyad-sh/nextjs-webpack-component-tagger",
      });
    }
    return config;
  },
};

export default nextConfig;
