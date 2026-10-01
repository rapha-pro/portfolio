import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    allowedDevOrigins: ["*.local", "10.0.0.*", "192.168.*.*", "172.16.*.*"],
    // Old project URLs that were renamed, kept so shared links still land.
    async redirects() {
        return [
            {
                source: "/projects/where-does-my-tax-go",
                destination: "/projects/where-does-my-tax-money-go",
                permanent: true,
            },
        ]
    },
}

export default nextConfig
