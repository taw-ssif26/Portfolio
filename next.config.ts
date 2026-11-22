import type { NextConfig } from "next";

const config: NextConfig = {
  // Add your media host (R2 public domain / Vercel Blob) here for next/image
  images: { remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }] },
};
export default config;
