/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        pathname: "/**",
        hostname: "**",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
    