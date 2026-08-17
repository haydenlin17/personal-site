import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    /*
     * Without this, Turbopack walks up past the project looking for a lockfile
     * and finds the one in the home directory, then warns that it is outside
     * the repo. Pinning the root to this folder keeps the build self contained.
     */
    root: __dirname,
  },
};

export default nextConfig;
