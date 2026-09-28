import type { NextConfig } from 'next';

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isGithubActions ? '/GitSleuth' : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubActions ? '/GitSleuth' : '',
  },
};

export default nextConfig;
