// next.config.mjs

import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, 
    swcMinify: true,
    transpilePackages: ["geist"],
    images: {
      domains: [
        "i.imgur.com", 
        "ipfs.decentralized-content.com",
        "gateway.pinata.cloud"
      ]
    },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
})(nextConfig);

