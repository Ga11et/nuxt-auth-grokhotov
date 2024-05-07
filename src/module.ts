import { defineNuxtModule, useLogger, createResolver, addPlugin, addImports } from '@nuxt/kit';
import { type moduleOptions } from './runtime/types';

const PACKAGE_NAME = 'nuxt-auth-grokhotov';

export default defineNuxtModule<moduleOptions>({
  meta: {
    name: PACKAGE_NAME,
    configKey: 'auth',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: {
    endpoints: {
      login: { path: '/auth/login', method: 'POST' },
      logout: { path: '/auth/logout', method: 'POST' },
      refresh: { path: '/auth/refresh', method: 'GET' },
      user: { path: '/auth/user', method: 'GET' },
    },
    cookieName: 'refresh_token',
    headerName: 'authorization',
    headerType: 'Bearer',
    state: {
      tokenName: 'auth:token',
      dataName: 'auth:data',
    },
    session: {
      maxAge: 1000 * 60 * 10,
    },
  },
  setup(options, nuxt) {
    const logger = useLogger(PACKAGE_NAME);

    logger.info(`${PACKAGE_NAME} setup starting`);

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

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    auth: moduleOptions;
  }
}
