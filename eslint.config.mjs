import { createConfigForNuxt } from '@nuxt/eslint-config/flat';

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: true,
  },
}).override('nuxt/stylistic', {
  rules: {
    '@stylistic/semi': 'warn',
  },
});
