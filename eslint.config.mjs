// Next 16 dropped the built-in `next lint` CLI; eslint-config-next now ships as a
// native ESLint 9 flat config array, so it's spread in directly (no FlatCompat needed).
import nextConfig from 'eslint-config-next';

const eslintConfig = [...nextConfig, { ignores: ['.next/**', 'node_modules/**'] }];

export default eslintConfig;
