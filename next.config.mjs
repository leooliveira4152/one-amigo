import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/features/locales/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ hostname: "firebasestorage.googleapis.com" }] },
};

export default withNextIntl(nextConfig);
