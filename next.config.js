/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "images.unsplash.com",
      "opnqqloemtaaowfttafs.supabase.co",
    ],
  },
  async headers() {
    return [
      {
        source: "/:all*.(svg|jpg|jpeg|png|webp|ico)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;