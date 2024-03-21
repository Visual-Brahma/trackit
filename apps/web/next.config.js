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
            },
            {
                source: "/mac/save",
                destination: "/save-report",
                permanent: true
            },
            {
                source: "/accounts/signup",
                destination: "/dashboard",
                permanent: false
            },
            {
                source: "/mac/dashboard",
                destination: "/dashboard",
                permanent: false
            }
        ];
    }
}

module.exports=nextConfig
