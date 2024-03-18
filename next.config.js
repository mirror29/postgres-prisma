const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias["@"] = path.join(__dirname, "./");
    // 添加更多的别名设置，按需配置
    return config;
  },
};

module.exports = nextConfig;
