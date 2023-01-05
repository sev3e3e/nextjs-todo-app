const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        appDir: true,
        swcPlugins: [["next-superjson-plugin", {}]],
    },
    // webpack: (config, { isServer }) => {
    //     if (isServer) return config;
    //     config.plugins.push(
    //         new BundleAnalyzerPlugin({
    //             analyzerMode: "static",
    //             reportFilename: "report.html",
    //             openAnalyzer: true,
    //         })
    //     );
    //     return config;
    // },
};

module.exports = nextConfig;
