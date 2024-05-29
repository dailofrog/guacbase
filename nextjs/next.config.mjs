/** @type {import('next').NextConfig} */
const nextConfig = {
	typescript: { ignoreBuildErrors: true },
	// We don't want to run ESLint Checking on Production Builds
	// as we already check it on the CI within each Pull Request
	// we also configure ESLint to run its lint checking on all files (next lint)
	eslint: { dirs: ['.'], ignoreDuringBuilds: true },
};

export default nextConfig;
