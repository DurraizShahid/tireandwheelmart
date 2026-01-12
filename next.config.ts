import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  // Turbopack configurationssss
  // Note: @dyad-sh/nextjs-webpack-component-tagger is Webpack-specific
  // and won't work with Turbopack. This config is added to resolve the warning.
  turbo: {
    // Add Turbopack-specific configuration here if needed
  },
};

export default nextConfig;
