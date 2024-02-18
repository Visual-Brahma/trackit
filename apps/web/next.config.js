/** @type {import('next').NextConfig} */
const nextConfig={
    reactStrictMode: true,
    transpilePackages: ["@repo/ui"],
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
