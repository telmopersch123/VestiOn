/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d4lgxe9bm8juw.cloudfront.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
