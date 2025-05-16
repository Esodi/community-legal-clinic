/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    domains: ["img.youtube.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  compiler: {
    styledComponents: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Suppress the warning about updating a component while rendering
    if (dev && !isServer) {
      config.ignoreWarnings = [
        { module: /node_modules\/@xyflow\/react/ },
        { message: /Cannot update a component/ },
      ];
    }
    return config;
  },
};

module.exports = nextConfig;
