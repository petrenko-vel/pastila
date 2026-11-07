const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: base,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
