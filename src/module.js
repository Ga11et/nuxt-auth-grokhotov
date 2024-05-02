import { defineNuxtModule, useLogger, createResolver, addPlugin, addImports } from '@nuxt/kit';

const PACKAGE_NAME = 'nuxt-auth-grokhotov';

export default defineNuxtModule({
  meta: {
    name: PACKAGE_NAME,
    configKey: 'auth',
  },
  defaults: {
    endpoints: {
      login: { path: '/login', method: 'post' },
      logout: { path: '/logout', method: 'post' },
      refresh: { path: '/refresh', method: 'get' },
      user: { path: '/user', method: 'get' },
    },
  },
  setup(options, nuxt) {
    const logger = useLogger(PACKAGE_NAME);

    logger.info('`nuxt-auth` setup starting');

    const { resolve } = createResolver(import.meta.url);

    nuxt.options.runtimeConfig = nuxt.options.runtimeConfig || { public: {} };
    nuxt.options.runtimeConfig.public.auth = options;

    addImports([
      {
        name: 'useAuth',
        from: resolve(`./runtime/composables/useAuth`),
      },
    ]);

    addPlugin(resolve('./runtime/plugins/auth-server'));
    addPlugin(resolve('./runtime/plugins/auth-client'));

    logger.success(`${PACKAGE_NAME} setup done`);
  },
});
