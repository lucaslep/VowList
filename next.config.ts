import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects() {
    return [
      {
        source: '/',
        destination: '/casamento/lucas-e-gabriella',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
