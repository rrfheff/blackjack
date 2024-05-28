import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    spacing: (() =>
      // eslint-disable-next-line node/no-unsupported-features/es-builtins
      Object.fromEntries(
        Array.from({ length: 1000 }).map((_, i) => [i, `${i}px`]),
      ))(),
  },
} as Config;
