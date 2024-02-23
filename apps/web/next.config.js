/** @type {import('next').NextConfig} */
const nextConfig={
    reactStrictMode: true,
    transpilePackages: ["@repo/ui"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            }
        ]
    },
    redirects: async () => {
        return [
            {
                source: "/g",
                destination: "/dashboard/groups",
                permanent: true,
            }
        ];
    }
}

module.exports=nextConfig
