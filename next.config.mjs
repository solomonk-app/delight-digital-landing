/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a fully static site into ./out — this is what Cloudflare Pages serves.
  output: 'export',

  // Cloudflare Pages serves static assets directly, so Next's on-demand image
  // optimization server isn't available. Disabling it lets <Image> (and plain
  // <img>) work against the static export without a runtime.
  images: {
    unoptimized: true,
  },

  // Emit /route/index.html instead of /route.html — friendlier for static hosts.
  trailingSlash: true,

  // Static export can't run ESLint's build step in some CI images; keep builds
  // deterministic on Cloudflare. Run `npm run lint` locally instead.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
