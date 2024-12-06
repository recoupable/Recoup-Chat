/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["geist"],
  images: {
    domains: ["i.imgur.com", "ipfs.decentralized-content.com"]
  },
};

export default nextConfig;
