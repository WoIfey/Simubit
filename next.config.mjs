/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '',
                pathname: '/u/**'
            },
            {
                protocol: 'https',
                hostname: 'wolfey.s-ul.eu'
            },
        ]
    }
};

export default nextConfig;
