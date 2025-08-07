import type { NextConfig } from "next";

const pwaConfig = require("next-pwa")({
    dest: "public",
});

const nextConfig: NextConfig = {
    /* config options here */
};

export default pwaConfig(nextConfig);
